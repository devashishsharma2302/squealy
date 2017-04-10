import dj_database_url

from django.apps.config import AppConfig


class SquealyAppConfig(AppConfig):
    name = 'squealy'

    def ready(self):
        from django.conf import settings
        settings.DATABASES = extract_dj_database_urls(settings.DATABASES)


def extract_dj_database_urls(DATABASES):
    '''
    Expects a dictionary containing database configuration.
    Updates the database configuration as specified in
    django admin
    '''
    from squealy.models import Database
    databases = Database.objects.all()
    if databases:
        del DATABASES['query_db']
        for database in databases:
            DATABASES[str(database.id)] = dj_database_url.parse(
                                                database.dj_url,
                                                conn_max_age=500
                                            )
            DATABASES[str(database.id)].update({'display_name': database.display_name})
    return DATABASES
