from .settings import *

INSTALLED_APPS = INSTALLED_APPS + ['django_nose',]
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

NOSE_ARGS = ['--with-coverage',
             '--cover-package=squealy']