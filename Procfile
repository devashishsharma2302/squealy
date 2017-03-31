web: gunicorn squealyproj.wsgi
worker: python manage.py celery worker --beat --loglevel=info --without-gossip --without-mingle --without-heartbeat
