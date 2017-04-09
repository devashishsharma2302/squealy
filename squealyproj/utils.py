import os
import dj_database_url

def extract_dj_database_urls(databases_as_string, DATABASES):
    '''
    Expects a string comma separated by dj_database_urls.
    Returns an object which contains details of all the databases
    entered by the user before deployment
    '''
    db_from_env = dj_database_url.config(conn_max_age=500)
    if db_from_env:
        DATABASES['default'] = db_from_env
    if databases_as_string:
        del DATABASES['query_db']
        databases_as_array = [db.strip() for db in databases_as_string.split(',')]
        for db in databases_as_array:
            db_config = dj_database_url.parse(db, conn_max_age=500)
            DATABASES[db_config['NAME']] = db_config