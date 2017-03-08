from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import connections
from django.shortcuts import render
from django.db import transaction

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAdminUser, BasePermission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from jinjasql import JinjaSql

from squealy.constants import SQL_WRITE_BLACKLIST
from squealy.serializers import ChartSerializer
from .exceptions import RequiredParameterMissingException,\
                        ChartNotFoundException, MalformedChartDataException, \
                        TransformationException, DatabaseWriteException
from .transformers import *
from .formatters import *
from .parameters import *
from .utils import SquealySettings
from .table import Table
from .models import Chart, Transformation, Validation, Parameter
from .validators import run_validation

jinjasql = JinjaSql()


class ChartViewPermission(BasePermission):

    def has_permission(self, request, view):
        chart_url = request.resolver_match.kwargs.get('chart_url')
        return request.user.has_perm('squealy.can_view_' + chart_url) or request.user.has_perm('squealy.can_edit_' + chart_url)

class ChartView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    permission_classes.append(ChartViewPermission)
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, chart_url=None, *args, **kwargs):
        """
        This is the API endpoint for executing the query and returning the data for a particular chart
        """
        chart_attributes = ['parameters', 'validations', 'transformations']
        chart = Chart.objects.filter(url=chart_url).prefetch_related(*chart_attributes).first()
        if not chart:
            raise ChartNotFoundException('No charts found at this path')
        params = request.GET.copy()
        user = request.user

        data = self._process_chart_query(chart, params, user)
        return Response(data)

    def post(self, request, chart_url=None, *args, **kwargs):
        """
        This is the endpoint for running and testing queries from the authoring interface
        """
        try:
            params = request.data.get('params', {})
            user = request.data.get('user', None)
            chart_attributes = ['parameters', 'validations', 'transformations']
            chart = Chart.objects.filter(url=chart_url).prefetch_related(*chart_attributes).first()
            if not chart:
                raise ChartNotFoundException('No charts found at this path')


            data = self._process_chart_query(chart, params, user)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)

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
            self._run_validations(params, user, validations)

        # Execute the Query, and return a Table
        table = self._execute_query(params, user, chart.query)

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

    def _run_validations(self, params, user, validations):
        for validation in validations:
            run_validation(params, user, validation.query)

    def _check_read_only_query(self, query):
        if any(keyword in query.upper() for keyword in SQL_WRITE_BLACKLIST):
            raise DatabaseWriteException('Database write commands not permitted in the query.')
        pass

    def _execute_query(self, params, user, chart_query):
        self._check_read_only_query(chart_query)

        query, bind_params = jinjasql.prepare_query(chart_query,
                                                    {
                                                     "params": params,
                                                     "user": user
                                                    })
        conn = connections['query_db']
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


class ChartUpdatePermission(BasePermission):

    def has_permission(self, request, view):
        if request.method == 'POST' and request.data.get('chart'):
            chart_data = request.data['chart']
            if chart_data.get('id'):
                # Chart update
                return request.user.has_perm('squealy.can_edit_' + chart_data['url'])
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
        charts = Chart.objects.all()
        for chart in charts:
            if request.user.has_perm('squealy.can_edit_' + chart.url):
                chart_data = ChartSerializer(chart).data
                chart_data['can_edit'] = True
                permitted_charts.append(chart_data)
            elif request.user.has_perm('squealy.can_view_' + chart.url):
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
            chart_url = Chart.objects.filter(id=data['id']).first().url
            Permission.objects.filter(codename__in=['can_view_' + chart_url, 'can_edit_' + chart_url]).delete()
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

            chart_object = Chart(id=data['id'], name=data['name'], url=data['url'], query=data['query'],
                                 type=data['type'], options=data['options'])
            chart_object.save()

            # Create view/edit permissions
            content_type = ContentType.objects.get_for_model(Chart)
            Permission.objects.update_or_create(
                codename='can_view_' + chart_object.url,
                name='Can view ' + chart_object.url,
                content_type=content_type,
            )
            Permission.objects.update_or_create(
                codename='can_edit_' + chart_object.url,
                name='Can edit ' + chart_object.url,
                content_type=content_type,
            )

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
        return Response(response)


@api_view(['GET'])
def squealy_interface(request, *args, **kwargs):
    """
    Renders the squealy authoring interface template
    """
    return render(request, 'index.html')
