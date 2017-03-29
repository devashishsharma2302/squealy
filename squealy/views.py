from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import connections
from django.db.utils import IntegrityError
from django.shortcuts import render
from django.db import transaction
from django.conf import settings
from django.core.mail import send_mail
from django.template import loader
from django.http import HttpResponse

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAdminUser, BasePermission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from squealy.constants import SQL_WRITE_BLACKLIST
from squealy.jinjasql_loader import configure_jinjasql
from squealy.serializers import ChartSerializer, FilterSerializer
from .exceptions import RequiredParameterMissingException,\
                        ChartNotFoundException, MalformedChartDataException, \
                        TransformationException, DatabaseWriteException, DuplicateUrlException
from .transformers import *
from .formatters import *
from .parameters import *
from .utils import SquealySettings
from .table import Table
from .models import Chart, Transformation, Validation, Parameter, \
    ScheduledReport, ReportParameter, ReportRecipient, Filter
from .validators import run_validation


jinjasql = configure_jinjasql()

class DatabaseView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, *args, **kwargs):
        try:
            database_response = []
            database = settings.DATABASES

            for db in database:
                if db != 'default':
                    database_response.append({
                      'value': db,
                      'label': database[db]['NAME']
                    })
            return Response({'databases': database_response})
        except Exception as e:
            return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)


class ChartViewPermission(BasePermission):

    def has_permission(self, request, view):
        chart_url = request.resolver_match.kwargs.get('chart_url')
        return request.user.has_perm('squealy.can_view_' + chart_url) or request.user.has_perm('squealy.can_edit_' + chart_url)


def temp_report(request):
    template = loader.get_template('report_template.html')
    scheduled_reports = ScheduledReport.objects.all()
    user = request.user

    for report in scheduled_reports:
        report_parameters = ReportParameter.objects.filter(report=report)
        chart_url = report.chart.url
        param_dict = {}

        for parameter in report_parameters:
            param_dict[parameter.parameter_name] = parameter.parameter_value
        chart_data = ChartProcessor().fetch_chart_data(chart_url, param_dict, user)
        chart = Chart.objects.get(url=chart_url)
        context = {
            'charts': chart_data,
            'name': chart.name
        }
        report_template = template.render(context, request)
        recipients = list(ReportRecipient.objects.filter(report=report).values_list('email', flat=True))

        try:
            send_mail(report.subject, 'Here is the message.', 'hashedinsquealy@gmail.com',
            recipients, fail_silently=False, html_message=report_template)
        except Exception as e:
            return HttpResponse('Unable to send email')

    return HttpResponse('Mail sent successfully')


class ChartProcessor(object):

    def fetch_chart_data(self, chart_url, params, user):
        """
        This method gets the chart data
        """
        chart_attributes = ['parameters', 'validations', 'transformations']
        chart = Chart.objects.filter(url=chart_url).prefetch_related(*chart_attributes).first()

        if not chart:
            raise ChartNotFoundException('Chart not found')

        if not chart.database:
            raise ChartNotFoundException('Database is not selected')

        return self._process_chart_query(chart, params, user)


    def fetch_filter_data(self, filter_url, params, user):
        filter = Filter.objects.filter(url=filter_url).first()

        if not filter:
            raise ChartNotFoundException('Filter not found')

        if not filter.database:
            raise ChartNotFoundException('Database is not selected')

        # Parse Parameters
        # parameter_definitions = filter.parameters.all()
        # if parameter_definitions:
        #     params = self._parse_params(params, parameter_definitions)

        # Execute the Query, and return a Table
        table = self._execute_query(params, user, filter.query, filter.database)

        # Format the table according to google charts / highcharts etc
        data = self._format(table, 'json')

        return data


    def _process_chart_query(self, chart, params, user):
        """
        Process and return the result after executing the chart query
        """

        # Parse Parameters
        parameter_definitions = chart.parameters.all()
        if parameter_definitions:
            params = self._parse_params(params, parameter_definitions)

        # Run Validations
        validations = chart.validations.all()
        if validations:
            self._run_validations(params, user, validations, chart.database)

        # Execute the Query, and return a Table
        table = self._execute_query(params, user, chart.query, chart.database)

        # Run Transformations
        transformations = chart.transformations.all()
        if transformations:
            table = self._run_transformations(table, transformations)

        # Format the table according to google charts / highcharts etc
        data = self._format(table, chart.format)

        return data

    def _parse_params(self, params, parameter_definitions):
        for index, param in enumerate(parameter_definitions):
            # Default values
            if param.default_value and \
                    param.default_value!= '' and \
                    params.get(param.name) in [None, '']:
                params[param.name] = param.default_value

            # Check for missing required parameters
            mandatory = param.mandatory

            if mandatory and params.get(param.name) is None:
                raise RequiredParameterMissingException("Parameter required: " + param.name)

            # Formatting parameters
            parameter_type_str = param.data_type
            kwargs = param.kwargs
            parameter_type = eval(parameter_type_str.title())
            if params.get(param.name):
                params[param.name] = parameter_type(param.name, **kwargs).to_internal(params[param.name])
        return params

    def _run_validations(self, params, user, validations, db):
        for validation in validations:
            run_validation(params, user, validation.query, db)

    def _check_read_only_query(self, query):
        if any(keyword in query.upper() for keyword in SQL_WRITE_BLACKLIST):
            raise DatabaseWriteException('Database write commands not permitted in the query.')
        pass

    def _execute_query(self, params, user, chart_query, db):
        self._check_read_only_query(chart_query)

        query, bind_params = jinjasql.prepare_query(chart_query,
                                                    {
                                                     "params": params,
                                                     "user": user
                                                    })
        conn = connections[db]
        with conn.cursor() as cursor:
            cursor.execute(query, bind_params)
            rows = []
            cols = [desc[0] for desc in cursor.description]
            for db_row in cursor:
                row_list = []
                for col in db_row:
                    value = col
                    if isinstance(value, str):
                        # If value contains a non english alphabet
                        value = value.encode('utf-8')
                    else:
                        value = value
                    row_list.append(value)
                rows.append(row_list)
        return Table(columns=cols, data=rows)

    def _format(self, table, format):
        if format:
            if format in ['table', 'json']:
                formatter = SimpleFormatter()
            else:
                formatter = eval(format)()
            return formatter.format(table)
        return GoogleChartsFormatter().format(table)

    def _run_transformations(self, table, transformations):
        try:
            if transformations:
                for transformation in transformations:
                    transformer_instance = eval(transformation.get_name_display())()
                    kwargs = transformation.kwargs
                    table = transformer_instance.transform(table, **kwargs)
                return table
        except ValueError as e:
            raise TransformationException("Error in transformation - " + e.message)

        return table


class ChartView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    permission_classes.append(ChartViewPermission)
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, chart_url=None, *args, **kwargs):
        """
        This is the API endpoint for executing the query and returning the data for a particular chart
        """
        params = request.GET.copy()
        user = request.user
        data = ChartProcessor().fetch_chart_data(chart_url, params, user)
        return Response(data)

    def post(self, request, chart_url=None, *args, **kwargs):
        """
        This is the endpoint for running and testing queries from the authoring interface
        """
        try:
            params = request.data.get('params', {})
            user = request.data.get('user', None)
            data = ChartProcessor().fetch_chart_data(chart_url, params, user)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)


class ChartUpdatePermission(BasePermission):

    def has_permission(self, request, view):
        if request.method == 'POST' and request.data.get('chart'):
            chart_data = request.data['chart']
            if chart_data.get('id'):
                # Chart update
                return request.user.has_perm('squealy.can_edit_' + str(chart_data['id']))
            else:
                # Adding new chart
                return request.user.has_perm('squealy.add_chart')
        elif request.method == 'DELETE' and request.data.get('id'):
            # Delete chart
            return request.user.has_perm('squealy.delete_chart')
        return True


class ChartsLoaderView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    permission_classes.append(ChartUpdatePermission)
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, *args, **kwargs):
        permitted_charts = []
        charts = Chart.objects.order_by('id').all()
        for chart in charts:
            if request.user.has_perm('squealy.can_edit_' + str(chart.id)):
                chart_data = ChartSerializer(chart).data
                chart_data['can_edit'] = True
                permitted_charts.append(chart_data)
            elif request.user.has_perm('squealy.can_view_' + str(chart.id)):
                chart_data = ChartSerializer(chart).data
                chart_data['can_edit'] = False
                permitted_charts.append(chart_data)
        return Response(permitted_charts)

    def delete(self, request):
        """
        To delete a chart
        """
        data = request.data
        try:
            chart = Chart.objects.filter(id=data['id']).first()
            Permission.objects.filter(codename__in=['can_view_' + str(chart.id), 'can_edit_' + str(chart.id)]).delete()
            Chart.objects.filter(id=data['id']).first().delete()
        except Exception:
            ChartNotFoundException('A chart with id' + data['id'] + 'was not found')
        return Response({})

    def post(self, request):
        """
        To save or update chart objects
        """
        try:
            data = request.data['chart']
            chart_object = Chart(
                            id=data['id'],
                            name=data['name'],
                            url=data['url'],
                            query=data['query'],
                            type=data['type'],
                            options=data['options'],
                            database=data['database']
                        )
            chart_object.save()

            # Create view/edit permissions
            content_type = ContentType.objects.get_for_model(Chart)

            # View permission
            perm_id = None
            perm = Permission.objects.filter(codename='can_view_' + str(chart_object.id)).first()
            if perm:
                perm_id = perm.id

            Permission(
                id=perm_id,
                codename='can_view_' + str(chart_object.id),
                name='Can view ' + chart_object.url,
                content_type=content_type,
            ).save()

            # Edit permission
            perm_id = None
            perm = Permission.objects.filter(codename='can_edit_' + str(chart_object.id)).first()
            if perm:
                perm_id = perm.id
            Permission(
                id=perm_id,
                codename='can_edit_' + str(chart_object.id),
                name='Can edit ' + chart_object.url,
                content_type=content_type,
            ).save()

            chart_id = chart_object.id
            Chart.objects.all().prefetch_related('transformations', 'parameters', 'validations')

            # Parsing transformations
            transformation_ids = []
            transformation_objects = []
            existing_transformations = {transformation.name: transformation.id
                                        for transformation in chart_object.transformations.all()}

            with transaction.atomic():
                for transformation in data['transformations']:
                    id = existing_transformations.get(transformation['name'], None)
                    transformation_object = Transformation(id=id, name=transformation['name'],
                                                           kwargs=transformation.get('kwargs', None),
                                                           chart=chart_object)
                    transformation_objects.append(transformation_object)
                    transformation_object.save()
                    transformation_ids.append(transformation_object.id)
            Transformation.objects.filter(chart=chart_object).exclude(id__in=transformation_ids).all().delete()

            # Parsing Parameters
            parameter_ids = []
            existing_parameters = {param.name: param.id
                                   for param in chart_object.parameters.all()}
            with transaction.atomic():
                for parameter in data['parameters']:
                    id = existing_parameters.get(parameter['name'], None)
                    parameter_object = Parameter(id=id, name=parameter['name'], data_type=parameter['data_type'],
                                                 mandatory=parameter['mandatory'],
                                                 default_value=parameter['default_value'],
                                                 test_value=parameter['test_value'], chart=chart_object,
                                                 type=parameter['type'],
                                                 order=parameter['order'],
                                                 kwargs=parameter['kwargs'])
                    parameter_object.save()
                    parameter_ids.append(parameter_object.id)
            Parameter.objects.filter(chart=chart_object).exclude(id__in=parameter_ids).all().delete()

            # Parsing validations
            validation_ids = []
            existing_validations = {validation.name: validation.id
                                    for validation in chart_object.validations.all()}
            with transaction.atomic():
                for validation in data['validations']:
                    id = existing_validations.get(validation['name'], None)
                    validation_object = Validation(id=id, query=validation['query'], name=validation['name'],
                                                   chart=chart_object)
                    validation_object.save()
                    validation_ids.append(validation_object.id)
            Validation.objects.filter(chart=chart_object).exclude(id__in=validation_ids).all().delete()

        except KeyError as e:
            raise MalformedChartDataException("Key Error - " + str(e.args))
        except IntegrityError as e:
            raise DuplicateUrlException('A chart with this url already exists')

        return Response(chart_id, status.HTTP_200_OK)


class UserInformation(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request):
        response = {}
        user = request.user
        response['name'] = user.username
        response['email'] = user.email
        response['first_name'] = user.first_name
        response['last_name'] = user.last_name
        response['can_add_chart'] = user.has_perm('squealy.add_chart')
        response['can_delete_chart'] = user.has_perm('squealy.delete_chart')
        response['isAdmin'] = user.is_superuser
        return Response(response)


class FilterEditPermission(BasePermission):

    def has_permission(self, request, view):
        filter_url = request.resolver_match.kwargs.get('url')
        return request.user.has_perm('squealy.can_edit_' + filter_url)


class FilterView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    permission_classes.append(FilterEditPermission)
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, filter_url=None, *args, **kwargs):
        """
        This is the API endpoint for executing the query and returning the data for a particular Filter
        """
        user = request.user
        # params = request.params
        data = ChartProcessor().fetch_filter_data(filter_url, [], user)
        return Response(data)


class FilterLoadView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    permission_classes.append(FilterEditPermission)
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, *args, **kwargs):
        filters = Filter.objects.order_by('id').all()
        permitted_filters = []
        for filter in filters:
            filter_data = FilterSerializer(filter).data
            if request.user.has_perm('squealy.can_edit_' + str(filter.id)):
                filter_data['can_edit'] = True
            permitted_filters.append(filter_data)

        return Response(permitted_filters)

    def delete(self, request):
        """
        To delete a chart
        """
        data = request.data
        try:
            chart = Filter.objects.filter(id=data['id']).first()
            Permission.objects.filter(codename__in=['can_edit_' + str(chart.id)]).delete()
            Filter.objects.filter(id=data['id']).first().delete()
        except Exception:
            ChartNotFoundException('A filter with id' + data['id'] + 'was not found')
        return Response({})

    def post(self, request):
        """
        To save or update chart objects
        """
        try:
            data = request.data['filter']
            filter_object = Filter(
                            id=data['id'],
                            name=data['name'],
                            url=data['url'],
                            query=data['query'],
                            format=data['format'],
                            database=data['database']
                        )
            filter_object.save()

            # Create edit permissions
            content_type = ContentType.objects.get_for_model(Filter)


            # Edit permission
            perm_id = None
            perm = Permission.objects.filter(codename='can_edit_' + str(filter_object.id)).first()
            if perm:
                perm_id = perm.id
            Permission(
                id=perm_id,
                codename='can_edit_' + str(filter_object.id),
                name='Can edit ' + filter_object.url,
                content_type=content_type,
            ).save()

            filter_id = filter_object.id
            Filter.objects.all()


        except KeyError as e:
            raise MalformedChartDataException("Key Error - " + str(e.args))
        except IntegrityError as e:
            raise DuplicateUrlException('A filter with this url already exists')

        return Response(filter_id, status.HTTP_200_OK)


@api_view(['GET'])
def squealy_interface(request, *args, **kwargs):
    """
    Renders the squealy authoring interface template
    """
    return render(request, 'index.html')
