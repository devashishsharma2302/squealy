import os
from os.path import join

import yaml
from django.conf import settings
from django.conf.urls import url
from yaml import load_all
from .utils import SquealySettings

from .views import SqlApiView
import rest_framework
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
                apiview_class.authentication_classes = SquealySettings.get_default_authentication_classes()
                apiview_class.permission_classes = SquealySettings.get_default_permission_classes()

                if config.get("authentication_classes"):
                    for authentication_class_as_str in config.get("authentication_classes"):
                        try:
                            apiview_class.authentication_classes.append(eval(authentication_class_as_str))
                        except:
                            pass

                if config.get("permission_classes"):
                    for permission_class_as_str in config.get("permission_classes"):
                        try:
                            apiview_class.permission_classes.append(eval(permission_class_as_str))
                        except:
                            pass
                urlpatterns.append(url(r'^'+config['url']+'[/]*$', apiview_class.as_view()))

        return urlpatterns

    @staticmethod
    def _generate_api_view(config):
        return type(str(config['id']), (SqlApiView, ), config)

    @staticmethod
    def _save_apis_to_file(json_data):
        directory = SquealySettings.get('YAML_PATH', join(settings.BASE_DIR, 'yaml'))

        if not os.path.exists(directory):
            os.makedirs(directory)

        file_name = SquealySettings.get('YAML_FILE_NAME', 'squealy-api.yaml')
        full_path = join(directory, file_name)

        with open(full_path, 'w+') as f:
            f.write(yaml.safe_dump_all(json_data, explicit_start=True))
        f.close()
