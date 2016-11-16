from django.conf.urls import url
from yaml import load_all
from squealy.views import SqlApiView

class ApiGenerator():

    @staticmethod
    def generate_urls_from_yaml(file_path):
        urlpatterns = []
        with open(file_path) as f:
            api_configs = load_all(f)
            for config in api_configs:
                apiview_class = ApiGenerator._generate_api_view(config)
                urlpatterns.append(url(r'^'+config['url'], apiview_class.as_view()))

        return urlpatterns

    @staticmethod
    def _generate_api_view(config):
        return type(config['id'], (SqlApiView, ), config)
