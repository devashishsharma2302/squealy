from django.shortcuts import render

from squealy.views import SqlApiView
# Create your views here.

class DatabaseTableReport(SqlApiView):
    query = "select name, sql, 5 as num from sqlite_master limit 4;"
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
    transformations = [{"name": "merge", "kwargs": {"columns_to_merge": ["sql","num"], "new_column_name": "merged_column"}}]
