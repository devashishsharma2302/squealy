import os
import dj_database_url

from django.conf import settings
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


def extra_dj_database_urls(databases_as_string):
    '''
    Expects a string comma separated by dj_database_urls.
    Returns an object which contains details of all the databases
    entered by the user before deployment
    '''
    databases = {}
    db_from_env = dj_database_url.config(conn_max_age=500)
    databases_as_array = [db.strip() for db in databases_as_string.split(',')]
    for db in databases_as_array:
        db_config = dj_database_url.parse(db, conn_max_age=500)
        databases[db_config['NAME']] = db_config
    databases['default'] = db_from_env
    return databases
