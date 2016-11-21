from rest_framework.views import APIView
from rest_framework.response import Response
from jinjasql import JinjaSql
from django.db import connections

from squealy.config import DateParameter, DateTimeParameter, StringParameter
from squealy.exception_handlers import RequiredParameterMissingException, ValidationFailedException
from squealy.transformer import TransformationsLoader, transformers
from .formatter import SimpleFormatter, FormatLoader, formatters
from .table import Table, Column
from pydoc import locate


jinjasql = JinjaSql()


class SqlApiView(APIView):
    # validations = []
    # transformations = []
    # formatter = DefaultFormatter
    connection_name = "default"
    

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
            params = self._validate_params(request)
        if hasattr(self, 'validations'):
            self.run_validations(params, user)

        # Execute the SQL Query, and return a Table
        table = self._execute_query(params, user)

        if hasattr(self, 'transformations'):
            # Perform basic transformations on the table
            transformations_loader = self.load_transformations_loader()
            table = transformations_loader.excecute_transformations(table)

        # Format the table according to google charts / highcharts etc
        formatter = self.get_formatter()

        # Return the response
        return Response(formatter.execute_formatter(table))

    # def validate_request(self, request):
    #     for validation in self.validations:
    #         validation.validate(request)

    def get_formatter(self):
        if hasattr(self, 'format'):
            return FormatLoader(formatters.get(self.format, None))
        return FormatLoader()

    def load_transformations_loader(self):
        transformers_requested = []
        for transformation in self.transformations:
            transformers_requested.append({"transformer": transformers[transformation.get("name", "default")], "kwargs": transformation.get("kwargs", {})})
        return TransformationsLoader(transformers_requested)

    def run_validations(self, params, user):
        for validation in self.validations:
            validation_function = locate(validation.get("validation_function").get("name"))
            kwargs = validation.get("validation_function").get("kwargs", {})
            if not validation_function(self, params, user, **kwargs):
                msg = validation.get("error_message", "Validation Failed")
                error_code = validation.get("error_code", 400)
                raise ValidationFailedException(msg, error_code)

    def _validate_params(self, request):
        params = request.GET.copy()
        for param in self.parameters:
            # Check for missing required parameters
            if not params.get(param):
                raise RequiredParameterMissingException("Parameter required",
                                                     param)

            # Formatting parameters
            parameter_type = self.parameters[param].get("type", "string")
            if parameter_type.lower() == "date":
                date_format = self.parameters[param].get("format")
                date_output_format = self.parameters[param].get("output_format")
                params[param] = DateParameter(param, format=date_format, output_format=date_output_format).to_internal(params[param])
            if parameter_type.lower() == "datetime":
                datetime_format = self.parameters[param].get("format")
                datetime_output_format = self.parameters[param].get("output_format")
                params[param] = DateTimeParameter(param, format=datetime_format, output_format=datetime_output_format).to_internal(params[param])
            if parameter_type.lower() == "string":
                params[param] = StringParameter(param).to_internal(params[param])
        return params

    def _execute_query(self, params, user):
        query, bind_params = jinjasql.prepare_query(self.query, {"params": params, "user": user})
        conn = connections[self.connection_name]
    
        with conn.cursor() as cursor:
            cursor.execute(query, bind_params)
            cols = []
            rows = []
            for desc in cursor.description:
                # if column definition is provided
                if hasattr(self, 'columns') and self.columns.get(desc[0]):
                    column = self.columns.get(desc[0])
                    cols.append(Column(name=desc[0], data_type=column.get('data_type', 'string'), col_type=column.get('type', 'dimension')))
                else:
                    cols.append(Column(name=desc[0], data_type='string', col_type='dimension'))

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