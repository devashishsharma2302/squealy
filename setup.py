#!/usr/bin/env python
import os
from setuptools import find_packages

__version__ = '0.1.0'

long_description = '''
Squealy is a django app for auto-generating reporting APIs. All configurations are passed through a single .yml file, which includes sql queries to fetch report data for each API.

- There is support for auto-formatting the data to google charts and highcharts format for quick dashboard integration.
-
- Squealy also supports sql templates based on jinjasql, hence, complex parameterized sql queries can be written.

- Squealy-generated APIs are based on Django Rest Framework. All APIs can be easily configured to use the authentication classes provided by django rest framework.

- Squealy supports parameter level and API level validation/authorization as well.

- Squealy is highly customizable.
'''

sdict = {
    'name' : 'squealy',
    'packages': find_packages(),
    'include_package_data': True,
    'version' : __version__,
    'description' : 'Write SQL, Generate REST APIs',
    'long_description' : long_description,
    'url': 'https://github.com/hashedin/squealy',
    'author' : 'Sripathi Krishnan, Hemny Singh, Swapnil Tiwari, Devashish Sharma, Vaibhav Singh',
    'author_email' : 'Sripathi@hashedin.com',
    'maintainer' : 'Sripathi Krishnan',
    'maintainer_email' : 'Sripathi@hashedin.com',
    'keywords' : ['Django', 'Django Rest Framework', 'SQL', 'drf', 'API', 'api', 'Google Charts', 'highcharts', 'dashboard', 'report'],
    'license' : 'MIT',
    'packages' : ['squealy'],
    'test_suite' : 'tests.all_tests',
    'install_requires': [
        'jinjasql',
        'Django>=1.10.2',
        'djangorestframework>=3.5.1',
        'PyYAML>=3',
        'arrow>=0.8.0'
    ],
    'classifiers' : [
        'Development Status :: 4 - Beta',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ]
}

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

setup(**sdict)
