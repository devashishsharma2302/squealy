#!/usr/bin/env python
import os

# Duplicating version from jinjasql.__init__.py
# We can't directly import it from jinjasql,
# because during installation Jinja2 isn't installed as yet
# 
# There are several approaches to eliminate this redundancy,
# see https://packaging.python.org/single_source_version/
# but for now, we will simply maintain it in two places
__version__ = '0.1.0'

long_description = '''
TODO

'''

sdict = {
    'name' : 'squealy',
    'version' : __version__,
    'description' : 'Write SQL, Generate REST APIs',
    'long_description' : long_description,
    'url': 'https://github.com/hashedin/drf-squealy',
    'download_url' : 'http://cloud.github.com/downloads/hashedin/drf-squealy/drf-squealy-%s.tar.gz' % __version__,
    'author' : 'Sripathi Krishnan',
    'author_email' : 'Sripathi@hashedin.com',
    'maintainer' : 'Sripathi Krishnan',
    'maintainer_email' : 'Sripathi@hashedin.com',
    'keywords' : ['Django', 'Django Rest Framework', 'SQL', 'drf'],
    'license' : 'MIT',
    'packages' : ['squealy'],
    'test_suite' : 'tests.all_tests',
    'install_requires': [
        'jinjasql'
    ],
    'classifiers' : [
        'Development Status :: 4 - Beta',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.6',
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

