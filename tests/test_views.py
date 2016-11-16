from __future__ import unicode_literals
from django.test import TestCase, RequestFactory
import os, sys
root = os.path.dirname(__file__)
sys.path.append(root + "/../example/exampleapp")

from views import DatabaseTableReport

class SqlApiViewTest(TestCase):
    def test_get(self):
        # factory = APIRequestFactory()
        # request = factory.get('/example/table-report/')
        factory = RequestFactory()
        request = factory.get('/example/table-report/?name=testname&date=2008/09/08&datetime=2016/12/28%2012:12:12')
        response = DatabaseTableReport.as_view()(request)
        self.assertEqual(response.status_code, 200)
        #response.render()
        #print response.data
