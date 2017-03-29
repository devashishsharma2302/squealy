from django.db import transaction
from django.db.utils import IntegrityError

from .test_base_file import BaseTestCase
from squealy.models import Chart


class ChartsTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_schema(self)
        BaseTestCase.create_mock_client(self)

    def test_duplicate_url_creation(self):
        with transaction.atomic():
            with self.assertRaises(IntegrityError):
                Chart.objects.create(url='c01',
                                     query='select name,sum(experience) as experience,sum(salary) as salary'
                                           ' from employee_db group by name limit 4;',
                                     name='chart01', format='SimpleFormatter', type='ColumnChart', database='default')
                Chart.objects.create(url='c01',
                                     query='select name,sum(experience) as experience,sum(salary) as salary'
                                           ' from employee_db group by name limit 2;',
                                     name='chart01', format='SimpleFormatter', type='ColumnChart', database='default')

    def test_new_duplicate_chart_api(self):
        with transaction.atomic():
            payload = """{"chart": {"name": "abc", "parameters": [], "database": null, "url": "c02",
                                 "chartData": {}, "validations": [], "options": {}, "testParameters": {},
                                 "newColumnName": "", "query": "", "apiErrorMsg": null, "type": "ColumnChart",
                                 "id": null, "transformations": []}}"""
            response = self.client.post('/charts/', payload, content_type='application/json')
            self.assertEqual(response.status_code, 200)
            response = self.client.post('/charts/', payload, content_type='application/json')
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.data, {"detail": "A chart with this name already exists"})

    def tearDown(self):
        BaseTestCase.delete_schema(self)

