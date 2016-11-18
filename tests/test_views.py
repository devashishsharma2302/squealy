from __future__ import unicode_literals
from django.test import TestCase, RequestFactory
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from squealy.exception_handlers import RequiredParameterMissingException, DateParseException, DateTimeParseException
from squealy.views import SqlApiView
from squealy.apigenerator import ApiGenerator
from os.path import dirname, abspath, join


class ParameterSubstitutionView(SqlApiView):
    query = "select name, sql from sqlite_master where name = {{params.name}};"
    format = "table"
    parameters = {"name": { "type": "string"} }


class TestParameterSubstitution(TestCase):

    def test_get(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?name=testname')
        response = ParameterSubstitutionView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_required_parameter_missing_exception(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/')
        self.assertRaises(RequiredParameterMissingException, ParameterSubstitutionView.as_view(), request)



class MergeTransformationView(SqlApiView):
    query = "select name, sql, 5 as num from sqlite_master limit 2;"
    format = "table"

    transformations = [
                       {"name": "merge", "kwargs": {"columns_to_merge": ["sql","num"], "new_column_name": "merged_column"}}

    ]


class TestMergeTransformation(TestCase):

    def setUp(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/')
        self.response = MergeTransformationView.as_view()(request)

    def test_get(self):
        self.assertEqual(self.response.status_code, 200)

    def test_merged_column(self):
        self.response.render()
        self.assertIn({"name":"merged_column","data_type":"string"}, self.response.data.get('columns'))
        self.assertEqual(len(self.response.data.get('data')), 4)


class SplitTransformationView(SqlApiView):
    query = "select name, sql, 5 as num from sqlite_master limit 5;"
    columns = {
        "name": {
            "type": "dimension",
        },
        "sql": {
            "type": "dimension",
        },
        "num": {
            "type": "metric",
        }
    }
    format = "table"

    transformations = [
        {"name": "split", "kwargs": {"pivot_column": "name"}}

    ]


class TestSplitTransformation(TestCase):

    def setUp(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/')
        self.response = SplitTransformationView.as_view()(request)

    def test_get(self):
        self.assertEqual(self.response.status_code, 200)

    def test_split_data(self):
        self.response.render()
        self.assertEqual(len(self.response.data.get('columns')), 6)
        self.assertEqual(len(self.response.data.get('data')), 5)


class TransposeTransformationView(SqlApiView):
    query = "select name, sql from sqlite_master limit 5;"

    format = "table"

    transformations = [
        {"name": "transpose"}
    ]


class TestTransposeTransformation(TestCase):

    def setUp(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/')
        self.response = TransposeTransformationView.as_view()(request)

    def test_get(self):
        self.assertEqual(self.response.status_code, 200)

    def test_transpose_data(self):
        self.response.render()
        self.assertEqual(len(self.response.data.get('columns')), 6)
        self.assertEqual(len(self.response.data.get('data')), 1)


class DateParameterView(SqlApiView):
    query = "select date('2016-09-08') as some_date where some_date={{params.date}}"

    format = "table"

    parameters = {"date": {"type": "date", "format": "DD/MM/YYYY", "output_format": "YYYY/MM/DD"}}


class DateParameterMacroView(SqlApiView):
    query = "select DATE() as some_date where some_date={{params.date}}"

    format = "table"

    parameters = {"date": {"type": "date", "format": "DD/MM/YYYY", "output_format": "YYYY-MM-DD"}}


class TestDateParameter(TestCase):

    def setUp(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?date=08/09/2016')
        self.response = DateParameterView.as_view()(request)

    def test_get(self):
        self.assertEqual(self.response.status_code, 200)

    def test_data(self):
        self.response.render()
        self.assertEqual(len(self.response.data.get('data')), 1)

    def test_invalid_date_format_exception(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?date=08-09/2016')
        self.assertRaises(DateParseException, DateParameterView.as_view(), request)

    def test_date_macro_today(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?date=today')
        response = DateParameterMacroView.as_view()(request)
        self.assertEqual(len(response.data.get('data')), 1)


class DateTimeParameterView(SqlApiView):
    query = "select datetime('2016-09-08 10:44:50') as some_datetime where some_datetime = {{params.date_time}};"
    format = "table"
    parameters = {
        "date_time": {"type": "datetime", "format": "DD/MM/YYYY HH:mm:ss", "output_format": "YYYY-MM-DD HH:mm:ss"}}


class DateTimeParameterMacroView(SqlApiView):
    query = "select DATETIME() as some_datetime where some_datetime={{params.date_time}}"
    format = "table"
    parameters = {
        "date_time": {"type": "datetime", "format": "DD/MM/YYYY HH:mm:ss", "output_format": "YYYY-MM-DD HH:mm:ss"}}


class TestDateTimeParameter(TestCase):

    def setUp(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?date_time=08/09/2016 10:44:50')
        self.response = DateTimeParameterView.as_view()(request)

    def test_get(self):
        self.assertEqual(self.response.status_code, 200)

    def test_data(self):
        self.response.render()
        self.assertEqual(len(self.response.data.get('data')), 1)

    def test_invalid_datetime_format_exception(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?date_time=08/09/2016')
        self.assertRaises(DateTimeParseException, DateTimeParameterView.as_view(), request)

    def test_date_macro_now(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?date_time=now')
        response = DateTimeParameterMacroView.as_view()(request)
        self.assertEqual(len(response.data.get('data')), 1)


class TestYamlApiGeneration(TestCase):
    def setUp(self):
        TEST_YAML_ROOT = dirname(abspath(__file__))
        file_path = join(TEST_YAML_ROOT, "test_apis.yaml")
        self.squealy_urls = ApiGenerator.generate_urls_from_yaml(file_path)

    def test_multiple_generated_apis(self):
        factory = RequestFactory()
        request = factory.get('/example/api1/')
        response = self.squealy_urls[0].resolve('api1').func(request)
        response.render()
        self.assertEqual(response.status_code, 200)
        request = factory.get('/example/api2/')
        response = self.squealy_urls[1].resolve('api2').func(request)
        response.render()
        self.assertEqual(response.status_code, 200)

    def test_authentication_classes(self):
        factory = RequestFactory()
        request = factory.get('/example/api3/')
        view_func = self.squealy_urls[2].resolve('api3').func
        authentication_classes = view_func.view_class.authentication_classes
        self.assertIn(SessionAuthentication, authentication_classes)
        self.assertIn(BasicAuthentication, authentication_classes)
        self.assertIn(TokenAuthentication, authentication_classes)
