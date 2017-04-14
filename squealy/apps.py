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
    try:
        from squealy.models import Database
        databases = Database.objects.all()
        if databases:
            del DATABASES['query_db']
            for database in databases:
                DATABASES[str(database.id)] = dj_database_url.parse(
                                                    database.dj_url,
                                                    conn_max_age=0
                                                )
                database_type = database.dj_url.split(":")[0].strip()
                DATABASES[str(database.id)].update({'DISPLAY_NAME': database.display_name})
                if (database_type == 'postgres'):
                    DATABASES[str(database.id)]['OPTIONS'] = {'options': ''}
                    DATABASES[str(database.id)]['OPTIONS']['options'] = '-c default_transaction_read_only=on'
        return DATABASES
    except Exception:
        return DATABASES
