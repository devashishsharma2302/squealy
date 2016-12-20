from django.conf import settings
import rest_framework
from rest_framework.authentication import *
from rest_framework.permissions import *


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