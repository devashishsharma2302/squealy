from __future__ import unicode_literals
from django.test import TestCase, RequestFactory
from squealy.exception_handlers import RequiredParameterMissingException
from squealy.views import SqlApiView


class TestDatabaseTableReport(SqlApiView):
    query = "select name, sql, 5 as num, 123 as some_column from sqlite_master limit 4;"
    format = "table"
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
    transformations = [
                       {"name": "merge", "kwargs": {"columns_to_merge": ["sql","some_column"], "new_column_name": "merged_column"}},
                        {"name": "split", "kwargs": {"pivot_column": "name"}}
    ]
    parameters = {"name": { "type": "string"},
                  "date": {"type": "date", "format": "YYYY/MM/DD"},
                  "datetime": {"type": "datetime", "format": "YYYY/MM/DD HH:mm:ss"}}


class UnitTest(TestCase):
    def test_get(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?name=testname&date=2008/09/08&datetime=2016/12/28%2012:12:12')
        response = TestDatabaseTableReport.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_get1(self):
        factory = RequestFactory()
        request = factory.get('/example/table-report/?name=testname&date=2008/09/08')
        self.assertRaises(RequiredParameterMissingException, TestDatabaseTableReport.as_view(), request)
