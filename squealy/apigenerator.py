from django.conf.urls import url
from yaml import load_all
from squealy.views import SqlApiView
from rest_framework.authentication import *
from rest_framework.permissions import *

class ApiGenerator():

    @staticmethod
    def generate_urls_from_yaml(file_path):
        urlpatterns = []
        with open(file_path) as f:
            api_configs = load_all(f)
            for config in api_configs:
                apiview_class = ApiGenerator._generate_api_view(config)
                if config.get("authentication_classes"):
                    apiview_class.authentication_classes = []
                    for authentication_class_as_str in config.get("authentication_classes"):
                        apiview_class.authentication_classes.append(eval(authentication_class_as_str))
                if config.get("permission_classes"):
                    apiview_class.permission_classes = []
                    for permission_class_as_str in config.get("permission_classes"):
                        apiview_class.permission_classes.append(eval(permission_class_as_str))

                urlpatterns.append(url(r'^'+config['url'], apiview_class.as_view()))

        return urlpatterns

    @staticmethod
    def _generate_api_view(config):
        return type(config['id'], (SqlApiView, ), config)
