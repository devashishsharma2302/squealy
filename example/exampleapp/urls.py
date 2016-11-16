from django.conf.urls import url, include
from rest_framework import routers
from .views import DatabaseTableReport
from squealy.apigenerator import ApiGenerator
from os.path import dirname, abspath, join
# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.

YAML_ROOT = join(dirname(abspath(__file__)), "yaml")
file_path = join(YAML_ROOT, "apis.yaml")

squealy_urls = ApiGenerator.generate_urls_from_yaml(file_path)

urlpatterns = [
    url(r'^table-report/', DatabaseTableReport.as_view()),
    url(r'^squealy/', include(squealy_urls)),

]