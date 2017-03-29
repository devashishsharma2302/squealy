from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST': 'localhost',
        'NAME': 'squealy_test_db',
        'USER': 'root',
        'PASSWORD': 'root',
    },
}

INSTALLED_APPS = INSTALLED_APPS + ['django_nose',]
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

NOSE_ARGS = ['--with-coverage',
             '--cover-package=squealy']