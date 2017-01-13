import importlib
from os.path import join, isfile

from django.conf.urls import url, include
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import rest_framework


from jinjasql import JinjaSql
from django.db import connections
from django.shortcuts import render
from django.conf import settings
from .exceptions import RequiredParameterMissingException, DashboardNotFoundException
from .transformers import *
from .formatters import *
from .parameters import *
from .utils import SquealySettings
from .table import Table, Column
from pydoc import locate
import yaml
import os
import json
from django.core.files import File

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
            self.format = request.data.get('format', 'SimpleFormatter')
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
        for transformation in self.transformations:
            if '.' in transformation.get('name'):
                module_name, class_name = self.format.rsplit('.',1)
                module = importlib.import_module(module_name)
                transformer_instance = getattr(module, class_name)()
            else:
                transformer_instance = eval(transformation.get('name', 'TableTransformer').title())()
            kwargs = transformation.get("kwargs", {})
            table = transformer_instance.transform(table, **kwargs)
        return table

    def run_validations(self, params, user):
        for validation in self.validations:
            validation_function = locate(validation.get("validation_function").get("name"))
            kwargs = validation.get("validation_function").get("kwargs", {})
            validation_function(self, params, user, **kwargs)

    def parse_params(self, params):
        for param in self.parameters:
            # Default values
            if self.parameters[param].get('default_value') and\
                    params.get(param) in [None, '']:
                params[param] = self.parameters[param].get('default_value')

            # Check for missing required parameters
            is_parameter_optional = self.parameters[param].get('optional',
                                                               False)
            if not is_parameter_optional and not params.get(param):
                raise RequiredParameterMissingException("Parameter required: "+param)

            # Formatting parameters
            parameter_type_str = self.parameters[param].get("type", "String")
            kwargs = self.parameters[param].get("kwargs", {})
            if '.' in parameter_type_str:
                module_name, class_name = parameter_type_str.rsplit('.', 1)
                module = importlib.import_module(module_name)
                parameter_type = getattr(module, class_name)
            else:
                parameter_type = eval(parameter_type_str.title())
            if params.get(param):
                params[param] = parameter_type(param, **kwargs).to_internal(params[param])
        return params

    def _execute_query(self, params, user):

        query, bind_params = jinjasql.prepare_query(self.query,
                                                    {
                                                     "params": params,
                                                     "user": user
                                                    })
        conn = connections[self.connection_name]
        with conn.cursor() as cursor:
            cursor.execute(query, bind_params)
            cols = []
            rows = []
            for desc in cursor.description:
                # if column definition is provided
                if hasattr(self, 'columns') and self.columns and self.columns.get(desc[0]):
                    column = self.columns.get(desc[0])
                    cols.append(
                        Column(
                           name=desc[0],
                           data_type=column.get('data_type', 'string'),
                           col_type=column.get('type', 'dimension')
                        )
                    )
                else:
                    cols.append(
                        Column(name=desc[0],
                               data_type='string', col_type='dimension')
                    )
            for db_row in cursor:
                row_list = []
                for col_index, chart_col in enumerate(cols):
                    value = db_row[col_index]
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


class YamlGeneratorView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def post(self, request, *args, **kwargs):
        try:
            json_data = request.data.get('yamlData')
            ApiGenerator._save_apis_to_file(json_data)
            return Response({}, status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        try:
            directory = SquealySettings.get('YAML_PATH', join(settings.BASE_DIR, 'yaml'))
            if not os.path.exists(directory):
                os.makedirs(directory)
            file_name = SquealySettings.get('YAML_FILE_NAME', 'squealy-api.yaml')
            full_path = join(directory,file_name)
            if isfile(full_path):
                with open(full_path,'r') as f:
                    try:
                        api_list = []
                        api_data = yaml.safe_load_all(f)
                        for api in api_data:
                            api_list.append(api)
                        return Response(api_list, status.HTTP_200_OK)
                    except yaml.YAMLError as exc:
                        return Response({'yaml error': str(exc)}, status.HTTP_400_BAD_REQUEST)
                f.close()
                return Response({}, status.HTTP_200_OK)
            else:
                return Response({'message': 'No api generated.'}, status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)


class DynamicApiRouter(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    authentication_classes.extend(SquealySettings.get_default_authentication_classes())

    def get(self, request, *args, **kwargs):
        url_path = request.get_full_path()
        file_dir = SquealySettings.get('YAML_PATH', join(settings.BASE_DIR, 'yaml'))
        filename = SquealySettings.get('YAML_FILE_NAME', 'squealy-api.yaml')
        file_path = join(file_dir, filename)
        urls = ApiGenerator.generate_urls_from_yaml(file_path)
        response = url(r'', include(urls)).resolve(url_path.split('/squealy-apis/')[1].split('?')[0]).func(request)
        return response

    def post(self, request):
        file_dir = SquealySettings.get('YAML_PATH', join(settings.BASE_DIR, 'yaml'))
        filename = SquealySettings.get('YAML_FILE_NAME', 'squealy-api.yaml')
        file_path = join(file_dir, filename)
        apis = []
        if isfile(file_path):
            with open(file_path) as f:
                api_config = yaml.load_all(f)
                for api in api_config:
                    apis.append(api)
        new_api = request.data
        new_api['id'] = len(apis)+1
        apis.append(new_api)
        ApiGenerator._save_apis_to_file(apis)
        return Response({}, status.HTTP_200_OK)


class DashboardTemplateView(APIView):
    permission_classes = SquealySettings.get_default_permission_classes()
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


def squealy_interface(request):
    """
    Renders the squealy authouring interface template
    """
    return render(request, 'index.html')
