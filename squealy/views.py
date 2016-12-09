import importlib

from rest_framework.views import APIView
from rest_framework.response import Response
from jinjasql import JinjaSql
from django.db import connections
from django.shortcuts import render
from rest_framework import status
from django.conf import settings

from squealy.exceptions import RequiredParameterMissingException
from squealy.transformers import *
from squealy.formatters import *
from squealy.parameters import *
from .table import Table, Column
from pydoc import locate
import yaml
import os
import json
from django.core.files import File

jinjasql = JinjaSql()


class DatabaseView(APIView):

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
            query = 'Desc {}'.format(table['value'])
            with conn.cursor() as cursor:
                cursor.execute(query)
                column_metadata = []
                for meta in cursor:
                    column_metadata.append({
                        'column': meta[0],
                        'type': meta[1]
                    })
            return Response({'schema': column_metadata})
        else:
            with conn.cursor() as cursor:
                cursor.execute('Show tables;')
                tables = []
                for table_names in cursor:
                    tables.append({
                                   'value': str(table_names[0]),
                                   'label': str(table_names[0])
                                })
            return Response({'tables': tables})


class YamlGeneratorView(APIView):

    def post(self, request, *args, **kwargs):
        try:
            #FIX ME:: Remove Hardcoded Values
            json_data = json.loads(request.body).get('yamlData')
            directory = os.path.join(os.path.dirname(os.path.dirname(__file__)),'yaml/')
            if not os.path.exists(directory):
                os.makedirs(directory)
            with open(directory+'api.yaml','w+') as f:
                myfile = File(f)
                myfile.write(yaml.safe_dump_all(json_data, explicit_start=True))
            f.close()
            myfile.close()    
            return Response({}, status.HTTP_200_OK)
        except  Exception as e:
            return Response({'error': str(e)}, status.HTTP_400_BAD_REQUEST)    


class SqlApiView(APIView):
    # validations = []
    # transformations = []
    # formatter = DefaultFormatter
    connection_name = "default"

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
            if request.data.get('format') not in ['table', 'json']:
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

        # First, validate the request parameters
        # If validation fails, a sub-class of ApiException
        # must be raised
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

    # def validate_request(self, request):
    #     for validation in self.validations:
    #         validation.validate(request)

    def _format(self, table):
        if hasattr(self, 'format'):
            if '.' in self.format:
                module_name, class_name = self.format.rsplit('.',1)
                module = importlib.import_module(module_name)
                formatter = getattr(module, class_name)()
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
               params.get(param) == None:
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
                if hasattr(self, 'columns') and self.columns.get(desc[0]):
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

    # def get_serializer(self, *args, **kwargs):
    #     """
    #     Return the serializer instance that should be used for validating and
    #     deserializing input, and for serializing output.
    #     """
    #     serializer_class = self.get_serializer_class()
    #     kwargs['context'] = self.get_serializer_context()
    #     return serializer_class(*args, **kwargs)

    # def get_serializer_class(self):
    #     """
    #     Return the class to use for the serializer.
    #     Defaults to using `self.serializer_class`.
    #     You may want to override this if you need to provide different
    #     serializations depending on the incoming request.
    #     (Eg. admins get full serialization, others get basic serialization)
    #     """
    #     assert self.serializer_class is not None, (
    #         "'%s' should either include a `serializer_class` attribute, "
    #         "or override the `get_serializer_class()` method."
    #         % self.__class__.__name__
    #     )

    #     return self.serializer_class

    # def get_serializer_context(self):
    #     """
    #     Extra context provided to the serializer class.
    #     """
    #     return {
    #         'request': self.request,
    #         'format': self.format_kwarg,
    #         'view': self
    #     }

    # def transform(self, table, request):
    #     """
    #     table.columns = 1-d array describing the data
    #     table.data = 2-d array

    #     transormations = array of transformations
    #     possible transformations:
    #     1. transpose
    #     2. split colulmn
    #     3. combine columns
    #     """
    #     for transform in self.transformations:
    #         func = transform["function"]
    #         params = transform["params"]
    #         table = func(table, **params)
    #     return table


def squealy_interface(request):
    """
    Renders the squealy authouring interface template
    """
    return render(request, 'index.html')
