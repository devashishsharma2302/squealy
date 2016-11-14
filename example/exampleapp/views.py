from django.shortcuts import render

from squealy.views import SqlApiView
# Create your views here.

class DatabaseTableReport(SqlApiView):
    query = "select name, sql from sqlite_master where name = {{ params.name }};"
    format = "table"
    transformations = ["transpose"]
    parameters = {"name": { "type": "string"}}

