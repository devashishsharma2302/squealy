from django.db import connection

from .test_base_file import BaseTestCase
from squealy.transformers import *
from django.contrib.auth.models import User
from squealy.models import Chart,Transformation


class TransformersTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_mock_client(self)
        BaseTestCase.create_schema(self)
        self.chart = BaseTestCase.create_chart(self)
        self.transform_object = Transformation.objects.create(chart=self.chart)

    def _create_schema_for_split(self):
        with connection.cursor() as c:
            query = 'CREATE TABLE employee_monthly_salary (name VARCHAR(5), month varchar(10), salary INT)'
            values_list = [
                        ["emp1", "Jan", 40000],
                        ["emp1", "Feb", 40500],
                        ["emp2", "Jan", 50000],
                        ["emp3", "Feb", 60000],
                        ["emp4", "Jan", 70000],
                        ["emp5", "Jan", 45000],
                        ["emp5", "Feb", 46000],
                        ["emp6", "Jan", 41000],
                        ["emp6", "Feb", 48000],
                        ["emp6", "Mar", 48000],
                        ["emp6", "Apr", 48000],
                        ]
            c.execute(query)
            for value in values_list:
                query1 = 'INSERT INTO employee_monthly_salary VALUES('+`str(value[0])`+','+`str(value[1])`+','+`value[2]`+')'
                c.execute(query1)

        self.chart = Chart.objects.create(url='test-split',
                                          query=""" select name, month, salary
                                                    from employee_monthly_salary;
                                                    """,
                                          name='Testing split', format='SimpleFormatter',
                                          type='ColumnChart',
                                          database='default')

    def test_transpose_transformation(self):
        response = self.client.get('/squealy/' + self.chart.name + '/')
        jsonResponse = response.json()
        self.assertDictEqual(jsonResponse,{u'data': [[u'experience', 5, 10, 6, 15, 15], [u'salary', 11, 4, 9, 7, 10]], u'columns': [u'name', u'test1', u'test2', u'test3', u'test4', u'test5']})

    def test_split_transformation(self):
        self._create_schema_for_split()
        self.transform_object.name = 2
        self.transform_object.chart = self.chart
        self.transform_object.kwargs = {"metric_column": "salary", "pivot_column": "month"}
        self.transform_object.save()
        response = self.client.get('/squealy/' + self.chart.url + '/')
        json_response = response.json()
        self.assertDictEqual(json_response,{u'data': [[u'emp1', 40000, 40500, u'-', u'-'],
                                                      [u'emp2', 50000, u'-', u'-', u'-'],
                                                      [u'emp3', u'-', 60000, u'-', u'-'],
                                                      [u'emp4', 70000, u'-', u'-', u'-'],
                                                      [u'emp5', 45000, 46000, u'-', u'-'],
                                                      [u'emp6', 41000, 48000, 48000, 48000]],
                                            u'columns': [u'name', u'Jan', u'Feb', u'Mar', u'Apr']})

    def test_merge_transformation(self):
        self.transform_object.name = 3
        self.transform_object.kwargs = {"columns_to_merge": ["experience", "salary"], "new_column_name": "new"}
        self.transform_object.save()
        response = self.client.get('/squealy/' + self.chart.name + '/')
        json_response = response.json()
        self.assertDictEqual(json_response,{u'data': [[u'test1', 5], [u'test1', 11], [u'test2', 10], [u'test2', 4], [u'test3', 6], [u'test3', 9], [u'test4', 15], [u'test4', 7], [u'test5', 15], [u'test5', 10]], u'columns': [u'name', u'new']})

    def tearDown(self):
        Chart.objects.all().delete()
        Transformation.objects.all().delete()
        BaseTestCase.delete_schema(self)


# class ParameterSubstitutionView(SqlApiView):
#     query = "select name, sql from sqlite_master where name = {{params.name}};"
#     format = "SimpleFormatter"
#     parameters = {"name": { "type": "string"}, "user_id": {"type": "string", "default_value": "user001"}, "optional_param": {"type": "string", "optional": True }}
# 
# 
# class TestParameterSubstitution(TestCase):
# 
#     def test_get(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?name=testname')
#         response = ParameterSubstitutionView.as_view()(request)
#         self.assertEqual(response.status_code, 200)
# 
#     def test_required_parameter_missing_exception(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/')
#         response = ParameterSubstitutionView.as_view()(request)
#         self.assertEqual(response.status_code, 400)
# 
#     def test_default_value(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?name=testname')
#         params = ParameterSubstitutionView().parse_params(request.GET.copy())
#         self.assertEqual(params.get('user_id'), 'user001')
# 
#     def test_optional_param(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?name=testname')
#         exception_raised = False
#         try:
#             ParameterSubstitutionView.as_view()(request)
#         except RequiredParameterMissingException:
#             exception_raised = True
#         self.assertFalse(exception_raised)
# 
# class SessionParameterSubstitutionView(SqlApiView):
#     query = "select name, sql, 'user001' as user_name from sqlite_master where user_name = {{user.username}};"
#     format = "SimpleFormatter"
# 
# 
# class TestSessionParameterSubstitution(TestCase):
# 
#     def setUp(self):
#         factory = RequestFactory()
#         self.request = factory.get('/example/table-report/')
# 
#     def test_authenticated_user(self):
#         self.user = User.objects.create_user(username="user001")
#         self.request.user = self.user
#         response = SessionParameterSubstitutionView.as_view()(self.request)
#         response.render()
#         self.assertEqual(response.status_code, 200)
#         self.assertGreater(len(response.data.get('data', [])), 1)
# 
#     def test_unauthenticated_user(self):
#         self.user = User.objects.create_user(username="user002")
#         self.request.user = self.user
#         response = SessionParameterSubstitutionView.as_view()(self.request)
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.data.get('data', []), [[]])
# 
# '''
# Commenting the below test cases to remove dependency in MySql-python library that is currently unavailabe for python 3.4.x
# and 3.5.x
# '''
# 
# # class MysqlNumberParameterSubstitutionView(SqlApiView):
# #     query = "select * from django_content_type limit {{params.limit}};"
# #     format = "SimpleFormatter"
# #     connection_name = "test"
# #     parameters = {"limit": {"type": "number"}}
# #
# #
# # class TestMysqlNumberParameterSubstitution(TestCase):
# #     def test_get(self):
# #         factory = RequestFactory()
# #         request = factory.get('/example/table-report/?limit=2')
# #         response = MysqlNumberParameterSubstitutionView.as_view()(request)
# #         response.render()
# #         self.assertEqual(response.status_code, 200)
# #         self.assertEqual(len(response.data.get('data')), 2)
# #
# #
# # class SqlliteNumberParameterSubstitutionView(SqlApiView):
# #     query = "select name, sql from sqlite_master limit {{params.limit}}"
# #     format = "SimpleFormatter"
# #
# #
# # class TestSqlliteNumberParameterSubstitution(TestCase):
# #     def test_get(self):
# #         factory = RequestFactory()
# #         request = factory.get('/example/table-report/?limit=2')
# #         response = SqlliteNumberParameterSubstitutionView.as_view()(request)
# #         response.render()
# #         self.assertEqual(response.status_code, 200)
# #         self.assertEqual(len(response.data.get('data')), 2)
# 
# 
# class MergeTransformationView(SqlApiView):
#     query = "select name, sql, 5 as num from sqlite_master limit 2;"
#     format = "SimpleFormatter"
# 
#     transformations = [
#                        {"name": "Merge", "kwargs": {"columns_to_merge": ["sql","num"], "new_column_name": "merged_column"}}
# 
#     ]
# 
# 
# class TestMergeTransformation(TestCase):
# 
#     def setUp(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/')
#         self.response = MergeTransformationView.as_view()(request)
# 
#     def test_get(self):
#         self.assertEqual(self.response.status_code, 200)
# 
#     def test_merged_column(self):
#         self.response.render()
#         self.assertIn({
#             "name": "merged_column",
#             "data_type": "string",
#             "col_type": "dimension"
#         }, self.response.data.get('columns'))
#         self.assertEqual(len(self.response.data.get('data')), 4)
# 
# 
# class SplitTransformationView(SqlApiView):
#     query = "select name, sql, 5 as num from sqlite_master limit 5;"
#     columns = {
#         "name": {
#             "type": "dimension",
#         },
#         "sql": {
#             "type": "dimension",
#         },
#         "num": {
#             "type": "metric",
#         }
#     }
#     format = "SimpleFormatter"
# 
#     transformations = [
#         {"name": "Split", "kwargs": {"pivot_column": "name"}}
# 
#     ]
# 
# 
# class TestSplitTransformation(TestCase):
# 
#     def setUp(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/')
#         self.response = SplitTransformationView.as_view()(request)
# 
#     def test_get(self):
#         self.assertEqual(self.response.status_code, 200)
# 
#     def test_split_data(self):
#         self.response.render()
#         self.assertEqual(len(self.response.data.get('columns')), 6)
#         self.assertEqual(len(self.response.data.get('data')), 5)
# 
# 
# class TransposeTransformationView(SqlApiView):
#     query = "select name, sql from sqlite_master limit 5;"
# 
#     format = "SimpleFormatter"
# 
#     transformations = [
#         {"name": "Transpose"}
#     ]
# 
# 
# class TestTransposeTransformation(TestCase):
# 
#     def setUp(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/')
#         self.response = TransposeTransformationView.as_view()(request)
# 
#     def test_get(self):
#         self.assertEqual(self.response.status_code, 200)
# 
#     def test_transpose_data(self):
#         self.response.render()
#         self.assertEqual(len(self.response.data.get('columns')), 6)
#         self.assertEqual(len(self.response.data.get('data')), 1)
# 
# 
# class DateParameterView(SqlApiView):
#     query = "select date('2016-09-08') as some_date where some_date={{params.date}}"
# 
#     format = "SimpleFormatter"
# 
#     parameters = {"date": {"type": "date", "kwargs": {"format": "DD/MM/YYYY"}}}
# 
# 
# class DateParameterMacroView(SqlApiView):
#     query = "select DATE() as some_date where some_date={{params.date}}"
# 
#     format = "SimpleFormatter"
# 
#     parameters = {"date": {"type": "date", "kwargs": {"format": "DD/MM/YYYY"}}}
# 
# 
# class TestDateParameter(TestCase):
# 
#     def setUp(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?date=08/09/2016')
#         self.response = DateParameterView.as_view()(request)
# 
#     def test_get(self):
#         self.assertEqual(self.response.status_code, 200)
# 
#     def test_data(self):
#         self.response.render()
#         self.assertEqual(len(self.response.data.get('data')), 1)
# 
#     def test_invalid_date_format_exception(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?date=08-09/2016')
#         response = DateParameterView.as_view()(request)
#         self.assertEqual(response.status_code, 400)
# 
#     def test_date_parameter_datatype(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?date=08/09/2016')
#         params = DateParameterView().parse_params(request.GET.copy())
#         self.assertEqual(type(params.get('date')), datetime.date)
# 
#     def test_date_macro_today(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?date=today')
#         response = DateParameterMacroView.as_view()(request)
#         self.assertEqual(len(response.data.get('data')), 1)
# 
# 
# class DateTimeParameterView(SqlApiView):
#     query = "select datetime('2016-09-08 10:44:50') as some_datetime where some_datetime = {{params.date_time}};"
#     format = "SimpleFormatter"
#     parameters = {
#         "date_time": {"type": "datetime", "kwargs": {"format": "DD/MM/YYYY HH:mm:ss"}}}
# 
# 
# class DateTimeParameterMacroView(SqlApiView):
#     query = "select DATETIME() as some_datetime where some_datetime={{params.date_time}}"
#     format = "SimpleFormatter"
#     parameters = {
#         "date_time": {"type": "datetime", "kwargs": {"format": "DD/MM/YYYY HH:mm:ss"}}}
# 
# 
# class TestDateTimeParameter(TestCase):
# 
#     def setUp(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?date_time=08/09/2016 10:44:50')
#         self.response = DateTimeParameterView.as_view()(request)
# 
#     def test_get(self):
#         self.assertEqual(self.response.status_code, 200)
# 
#     def test_data(self):
#         self.response.render()
#         self.assertEqual(len(self.response.data.get('data')), 1)
# 
#     def test_invalid_datetime_format_exception(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?date_time=08/09/2016')
#         response = DateTimeParameterView.as_view()(request)
#         self.assertEqual(response.status_code, 400)
# 
#     def test_datetime_parameter_datatype(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?date_time=08/09/2016 10:44:50')
#         params = DateTimeParameterView().parse_params(request.GET.copy())
#         self.assertEqual(type(params.get('date_time')), datetime.datetime)
# 
#     def test_date_macro_now(self):
#         factory = RequestFactory()
#         request = factory.get('/example/table-report/?date_time=now')
#         response = DateTimeParameterMacroView.as_view()(request)
#         self.assertEqual(len(response.data.get('data')), 1)
# 
# 
# class TestYamlApiGeneration(TestCase):
#     def setUp(self):
#         TEST_YAML_ROOT = dirname(abspath(__file__))
#         file_path = join(TEST_YAML_ROOT, "test_apis.yaml")
#         self.squealy_urls = ApiGenerator.generate_urls_from_yaml(file_path)
# 
#     def test_multiple_generated_apis(self):
#         factory = RequestFactory()
#         request = factory.get('/example/api1/')
#         response = self.squealy_urls[0].resolve('api1').func(request)
#         response.render()
#         self.assertEqual(response.status_code, 200)
#         request = factory.get('/example/api2/')
#         response = self.squealy_urls[1].resolve('api2').func(request)
#         response.render()
#         self.assertEqual(response.status_code, 200)
# 
#     def test_authentication_classes(self):
#         factory = RequestFactory()
#         request = factory.get('/example/api3/')
#         view_func = self.squealy_urls[2].resolve('api3').func
#         authentication_classes = view_func.view_class.authentication_classes
#         self.assertIn(SessionAuthentication, authentication_classes)
#         self.assertIn(BasicAuthentication, authentication_classes)
#         self.assertIn(TokenAuthentication, authentication_classes)
# 
#     def test_permission_classes(self):
#         factory = RequestFactory()
#         request = factory.get('/example/api3/')
#         view_func = self.squealy_urls[2].resolve('api3').func
#         permission_classes = view_func.view_class.permission_classes
#         self.assertIn(IsAuthenticated, permission_classes)
# 
#     def test_authentication(self):
#         factory = RequestFactory()
#         request = factory.get('/example/api3/')
#         response = self.squealy_urls[2].resolve('api3').func(request)
#         self.assertEqual(response.status_code, 403)
# 
#     def test_custom_parameter(self):
#         factory = RequestFactory()
#         request = factory.get('/example/api4/?datetime=yesterday')
#         response = self.squealy_urls[3].resolve('api4').func(request)
#         response.render()
#         self.assertEqual(response.status_code, 200)
# 
#     def test_default_permission_and_auth_classes(self):
#         squealy_settings = {
#             'DEFAULT_PERMISSION_CLASSES': [
#                 'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
#             ],
#             'DEFAULT_AUTHENTICATION_CLASSES': [
#                 'rest_framework.authentication.TokenAuthentication'
#             ]
#         }
#         with self.settings(SQUEALY=squealy_settings):
#             self.setUp()
#             factory = RequestFactory()
#             request = factory.get('/example/api1/')
#             view_func = self.squealy_urls[0].resolve('api1').func
#             permission_classes = view_func.view_class.permission_classes
#             self.assertIn(DjangoModelPermissionsOrAnonReadOnly, permission_classes)
#             authentication_classes = view_func.view_class.authentication_classes
#             self.assertIn(TokenAuthentication, authentication_classes)

