from django.conf import settings
import rest_framework
from rest_framework.authentication import *
from rest_framework.permissions import *

from .models import *


class SquealySettings():

    @staticmethod
    def get_default_authentication_classes():
        authentication_classes = []
        if hasattr(settings, 'SQUEALY'):
            if settings.SQUEALY.get('DEFAULT_AUTHENTICATION_CLASSES'):
                for authentication_class_as_str in settings.SQUEALY.get('DEFAULT_AUTHENTICATION_CLASSES'):
                    authentication_classes.append(eval(authentication_class_as_str))
        return authentication_classes


    @staticmethod
    def get_default_permission_classes():
        permission_classes = []
        if hasattr(settings, 'SQUEALY'):
            if settings.SQUEALY.get('DEFAULT_PERMISSION_CLASSES'):
                for permission_class_as_str in settings.SQUEALY.get('DEFAULT_PERMISSION_CLASSES'):
                    permission_classes.append(eval(permission_class_as_str))
        return permission_classes

    @staticmethod
    def get(key, default=None):
        if hasattr(settings, 'SQUEALY'):
            return settings.SQUEALY.get(key, default)
        else:
            return default


class ChartConfig():

    def __init__(self, chart):
        self.chart = chart

    def get_parameters(self, chart):
        """
        Returns the parameters associated to the chart
        """
        return list(chart.parameters.all().values())

    def get_validations(self, chart):
        """
        Returns the parameters associated to the chart
        """
        return list(chart.validations.all().values())

    def get_columns(self, chart):
        """
        Returns the parameters associated to the chart
        """
        return list(chart.columns.all().values())

    def get_transformations(self, chart):
        """
        Returns the parameters associated to the chart
        """
        transformations_list = []
        for transformation in chart.transformations.all():
            transformations_list.append({
                'kwargs': transformation.kwargs,
                'name': transformation.get_name_display()
            })
        return transformations_list

    def get_chart_config(self, chart):
        """
        Returns the chart configuratios from the chart model in a dictionary
        """
        return {
                'name': chart.name,
                'format': chart.format,
                'url': chart.url,
                'query': chart.query,
                'type': chart.type,
                'account_id': chart.account_id
            }

    def get_config(self):
        """
        Returns related parameters, validations, transformations and columns
        """
        config = self.get_chart_config(self.chart)
        config['transformations'] = self.get_transformations(self.chart)
        config['validations'] = self.get_validations(self.chart)
        config['parameters'] = self.get_parameters(self.chart)
        config['columns'] = self.get_columns(self.chart)
        return config
