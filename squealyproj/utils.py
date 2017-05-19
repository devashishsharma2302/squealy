import os
import dj_database_url


def extract_dj_database_urls(databases_as_string, DATABASES):
    '''
    Expects a string comma separated by dj_database_urls.
    Returns an object which contains details of all the databases
    entered by the user before deployment
    '''
    if databases_as_string:
        databases_as_array = [db.strip() for db in databases_as_string.split(',')]
        for db in databases_as_array:
            db_config = dj_database_url.parse(db, conn_max_age=500)
            database_type = db.split(":")[0].strip()
            if database_type == 'postgres':
                if 'OPTIONS' not in db_config:
                    db_config['OPTIONS'] = {'options': ''}
                db_config['OPTIONS']['options'] = '-c default_transaction_read_only=on'
            display_name = db_config['NAME']
            if db_config.get('OPTIONS') and db_config['OPTIONS'].get('display_name'):
                display_name = db_config['OPTIONS'].get('display_name')
                del db_config['OPTIONS']['display_name']
            DATABASES[display_name] = db_config
        del DATABASES['query_db']
