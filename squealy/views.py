import importlib
import os

from os.path import join, isfile

from django.db import connections
from django.shortcuts import render
from django.conf import settings
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from jinjasql import JinjaSql

from squealy.serializers import ChartSerializer
from .exceptions import RequiredParameterMissingException,\
                        DashboardNotFoundException, ChartNotFoundException, MalformedChartDataException
from .transformers import *
from .formatters import *
from .parameters import *
from .utils import SquealySettings
from .table import Table
from .models import *
from .validators import run_validation

jinjasql = JinjaSql()

class SqlApiView(APIView):
    # validations = []
    # transformations = []
    # formatter = DefaultFormatter
    connection_name = "default"
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def post(self, request, *args, **kwargs):
        try:
            params = request.data.get('params', {})
            if request.data.get('connection'):
                self.connection_name = request.data.get('connection')
            # TODO: handle no query exception  here
            user = request.data.get('user', None)
            if request.data.get('parameters'):
                self.parameters = request.data.get('parameters')
                params = self.parse_params(params)
            if request.data.get('validations'):
                self.validations = request.data.get('validations')
                self.run_validations(params, user)
            self.query = request.data.get('config').get('query', '')
            self.columns = request.data.get('columns')
            # Execute the SQL Query, and return a Table
            table = self._execute_query(params, user)
            if request.data.get('transformations'):
                # Perform basic transformations on the table
                self.transformations = request.data.get('transformations', [])
                table = self._run_transformations(table)
            # Format the table according to the format requested
            self.format = request.data.get('format', 'GoogleChartsFormatter')
            data = self._format(table)
            return Response(data, status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        # When this function is called, DRF has already done:
        # 1. Authentication Checks
        # 2. Permission Checks
        # 3. Throttling
        params = request.GET.copy()
        user = request.user
        if hasattr(self, 'parameters'):
            params = self.parse_params(params)
        if hasattr(self, 'validations'):
            self.run_validations(params, user)
        # Execute the SQL Query, and return a Table
        table = self._execute_query(params, user)
        if hasattr(self, 'transformations'):
            # Perform basic transformations on the table
            table = self._run_transformations(table)
        # Format the table according to google charts / highcharts etc
        data = self._format(table)

        # Return the response
        return Response(data)

    def _format(self, table):
        if hasattr(self, 'format'):
            if '.' in self.format:
                module_name, class_name = self.format.rsplit('.',1)
                module = importlib.import_module(module_name)
                formatter = getattr(module, class_name)()
            elif self.format in ['table', 'json']:
                formatter = SimpleFormatter()
            else:
                formatter = eval(self.format)()
            return formatter.format(table)
        return SimpleFormatter().format(table)

    def _run_transformations(self, table):
        if self.transformations:
            for transformation in self.transformations:
                transformer_instance = eval(transformation.get('name').title())()
                kwargs = transformation.get("kwargs") if transformation.get("kwargs") else {}
                table = transformer_instance.transform(table, **kwargs)
            return table
        else:
            table = TableTransformer().transform(table, {})
            return table

    def run_validations(self, params, user):
#         for validation in self.validations:
#             validation_function = locate(validation.get("validation_function").get("name"))
#             kwargs = validation.get("validation_function").get("kwargs", {})
#             validation_function(self, params, user, **kwargs)
        for validation in self.validations:
            run_validation(params, user, validation['query'])

    def parse_params(self, params):
        for index, param in enumerate(self.parameters):

            # Default values
            if self.parameters[index].get('default_value') and \
                            self.parameters[index].get('default_value') != '' and \
                            params.get(param['name']) in [None, '']:
                params[param['name']] = self.parameters[index].get('default_value')

            # Check for missing required parameters
            mandatory = self.parameters[index].get('mandatory',
                                                               False)
            if mandatory and params.get(param['name']) is None:
                raise RequiredParameterMissingException("Parameter required: " + param['name'])

            # Formatting parameters
            parameter_type_str = self.parameters[index].get("data_type", "String")
            kwargs = self.parameters[index].get("kwargs", {})
            if '.' in parameter_type_str:
                module_name, class_name = parameter_type_str.rsplit('.', 1)
                module = importlib.import_module(module_name)
                parameter_type = getattr(module, class_name)
            else:
                parameter_type = eval(parameter_type_str.title())
            if params.get(param['name']):
                params[param['name']] = parameter_type(param['name'], **kwargs).to_internal(params[param['name']])
        return params

    def _execute_query(self, params, user):
        query, bind_params = jinjasql.prepare_query(self.query,
                                                    {
                                                     "params": params,
                                                     "user": user
                                                    })
        conn = connections['userdb']
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

# TODO: remove this circular dependency
from .apigenerator import ApiGenerator


class DatabaseView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, *args, **kwargs):
        try:
            database_response = []
            database = settings.DATABASES
            for db in database:
                database_response.append({
                  'value': db,
                  'label': database[db]['NAME']
                })
            return Response({'database': database_response})
        except Exception as e:
            return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        connection_name = request.data.get('database', None)
        conn = connections[connection_name['value']]
        table = request.data.get('table', None)

        if table:
            query = 'select column_name, data_type from INFORMATION_SCHEMA.COLUMNS where table_name=%s'
            with conn.cursor() as cursor:
                cursor.execute(query, [table['value']])
                column_metadata = []
                for meta in cursor:
                    column_metadata.append({
                        'column': meta[0],
                        'type': meta[1]
                    })
            return Response({'schema': column_metadata})
        else:
            table_schema = connection_name['label']
            if conn.vendor == 'postgresql':
                table_schema = 'public'
            with conn.cursor() as cursor:
                cursor.execute('select TABLE_NAME from information_schema.tables a where a.table_schema=%s',
                               [table_schema])
                tables = []
                for table_names in cursor:
                    tables.append({
                                   'value': str(table_names[0]),
                                   'label': str(table_names[0])
                                })
            return Response({'tables': tables})


# class YamlGeneratorView(APIView):
#     permission_classes = SquealySettings.get_default_permission_classes()
#     authentication_classes = [SessionAuthentication, BasicAuthentication]
#     authentication_classes.extend(SquealySettings.get_default_authentication_classes())
#
#     def post(self, request, *args, **kwargs):
#         try:
#             json_data = request.data.get('yamlData')
#             ApiGenerator._save_apis_to_file(json_data)
#             return Response({}, status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)
#
#     def get(self, request, *args, **kwargs):
#         try:
#             directory = SquealySettings.get('YAML_PATH', join(settings.BASE_DIR, 'yaml'))
#             if not os.path.exists(directory):
#                 os.makedirs(directory)
#             file_name = SquealySettings.get('YAML_FILE_NAME', 'squealy-api.yaml')
#             full_path = join(directory,file_name)
#             if isfile(full_path):
#                 with open(full_path,'r') as f:
#                     try:
#                         api_list = []
#                         api_data = yaml.safe_load_all(f)
#                         for api in api_data:
#                             api_list.append(api)
#                         return Response(api_list, status.HTTP_200_OK)
#                     except yaml.YAMLError as exc:
#                         return Response({'yaml error': str(exc)}, status.HTTP_400_BAD_REQUEST)
#                 f.close()
#                 return Response({}, status.HTTP_200_OK)
#             else:
#                 return Response({'message': 'No api generated.'}, status.HTTP_204_NO_CONTENT)
#
#         except Exception as e:
#             return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)


class ChartsLoaderView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, *args, **kwargs):
        charts = Chart.objects.all()
        response = ChartSerializer(charts, many=True).data
        return Response(response)


class DynamicApiRouter(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path().split('/squealy-apis/')[1].split('?')[0]
        chart_attributes = ['parameters', 'columns', 'validations', 'transformations']
        chart = Chart.objects.filter(url=url_path).prefetch_related(*chart_attributes)
        if not chart:
            raise ChartNotFoundException('A chart with this url was not found.')
        view_class = ApiGenerator.generate_sql_apiview(chart[0])
        response = view_class.as_view()(request)
        return response

    '''
    To delete a chart
    '''
    def delete(self, request):
        data = request.data
        Chart.objects.filter(id= data['id']).first().delete()
        return Response({})

    '''
    To save or update chart objects
    '''
    def post(self, request):
        try:
            data = request.data['chart']
            chart_object = Chart(id=data['id'], name=data['name'], url=data['url'], query=data['query'],
                                 type=data['type'], options=data['options'])
            chart_object.save()
            chart_id = chart_object.id
            Chart.objects.all().prefetch_related('transformations', 'parameters', 'validations')

            # Parsing transformations
            transformation_ids = []
            existing_transformations = {transformation.name: transformation.id
                                        for transformation in chart_object.transformations.all()}
            for transformation in data['transformations']:
                id = existing_transformations.get(transformation['name'], None)
                transformation_object = Transformation(id=id, name=transformation['name'],
                                                       kwargs=transformation.get('kwargs', None),chart=chart_object)
                transformation_object.save()
                transformation_ids.append(transformation_object.id)
            Transformation.objects.filter(chart=chart_object).exclude(id__in=transformation_ids).all().delete()

            # Parsing Parameters
            parameter_ids = []
            existing_parameters = {param.name: param.id
                                   for param in chart_object.parameters.all()}
            for parameter in data['parameters']:
                id = existing_parameters.get(parameter['name'], None)
                parameter_object = Parameter(id=id, name=parameter['name'], data_type=parameter['data_type'],
                                             mandatory=parameter['mandatory'], default_value=parameter['default_value'],
                                             test_value=parameter['test_value'], chart=chart_object,
                                             kwargs=parameter['kwargs'])
                parameter_object.save()
                parameter_ids.append(parameter_object.id)

            Parameter.objects.filter(chart=chart_object).exclude(id__in=parameter_ids).all().delete()

            # Parsing validations
            validation_ids = []
            existing_validations = {validation.name: validation.id
                                   for validation in chart_object.validations.all()}
            for validation in data['validations']:
                id = existing_validations.get(validation['name'], None)
                validation_object = Validation(id=id, query=validation['query'],name=validation['name'], chart=chart_object)
                validation_object.save()
                validation_ids.append(validation_object.id)
            Validation.objects.filter(chart=chart_object).exclude(id__in=validation_ids).all().delete()

        except KeyError as e:
            raise MalformedChartDataException("Key Error - "+ str(e.args))

        return Response(chart_id, status.HTTP_200_OK)

@permission_classes(SquealySettings.get('Authoring_Interface_Permission_Classes', (IsAdminUser, )))
class DashboardTemplateView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, api_name=None):
        if not api_name:
            raise DashboardNotFoundException('Parameter Required - dashboard api-name not provided in url')
        file_dir = SquealySettings.get('YAML_PATH', join(settings.BASE_DIR, 'yaml'))
        filename = SquealySettings.get('DASHBOARD_FILE_NAME', 'squealy_dashboard.yaml')
        template_name = SquealySettings.get('DASHBOARD_TEMPLATE', 'squealy-dashboard.html')
        file_path = join(file_dir, filename)
        dashboard = {}
        if isfile(file_path):
            with open(file_path) as f:
                dashboards_config = yaml.load_all(f)
                for config in dashboards_config:
                    if config.get('apiName', '').lower().replace(' ', '-') == api_name:
                        dashboard = config
        return render(request, template_name, {'dashboard': dashboard})


class DashboardApiView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request):
        file_dir = SquealySettings.get('YAML_PATH', join(settings.BASE_DIR, 'yaml'))
        dashboard_file_name = SquealySettings.get('dashboard_filename', 'squealy_dashboard.yaml')
        dashboard_file_path = join(file_dir, dashboard_file_name)
        dashboards = []
        if isfile(dashboard_file_path):
            with open(dashboard_file_path) as f:
                for dashboard in yaml.load_all(f):
                    dashboards.append(dashboard)
        return Response(dashboards)

    def post(self, request):
        dashboards = request.data
        directory = SquealySettings.get('YAML_PATH', join(settings.BASE_DIR, 'yaml'))

        if not os.path.exists(directory):
            os.makedirs(directory)

        file_name = SquealySettings.get('dashboard_filename', 'squealy_dashboard.yaml')
        full_path = join(directory, file_name)
        with open(full_path, 'w+') as f:
            f.write(yaml.safe_dump_all(dashboards, explicit_start=True, default_flow_style=False))
        f.close()
        return Response({}, status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes(SquealySettings.get('Authoring_Interface_Permission_Classes', (IsAdminUser, )))
def squealy_interface(request):
    """
    Renders the squealy authouring interface template
    """
    return render(request, 'index.html')
