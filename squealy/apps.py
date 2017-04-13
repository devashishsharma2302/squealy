import dj_database_url

from django.apps.config import AppConfig
from django.db import connections


class SquealyAppConfig(AppConfig):
    name = 'squealy'

    def ready(self):
        extract_dj_database_urls()


def extract_dj_database_urls():
    '''
    Expects a dictionary containing database configuration.
    Updates the database configuration as specified in
    django admin
    '''
    from squealy.models import Database
    databases = Database.objects.all()
    if databases:
        del connections.databases['query_db']
        for database in databases:
            db_config = dj_database_url.parse(
                                                database.dj_url,
                                                conn_max_age=500
                                            )
            db_config['id'] = str(database.id)
            db_config['DISPLAY_NAME'] = database.display_name
            connections.databases[str(database.id)] = db_config
