from django.conf.urls import url, include
from rest_framework import routers
from .views import DatabaseTableReport


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^table-report/', DatabaseTableReport.as_view()),
]