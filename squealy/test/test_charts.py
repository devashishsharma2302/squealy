import json

from django.db import transaction
from django.db.utils import IntegrityError

from .test_base_file import BaseTestCase
from squealy.models import Chart, Parameter


class ChartsTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_schema(self)
        BaseTestCase.create_mock_client(self)
        self.chart = BaseTestCase.create_chart(self)
        self.chart.query = 'select name,sum(experience) as experience,sum(salary) as salary from employee_db where date_of_joining < {{params.start_date}} group by name'
        self.chart.save()
        self.parameter = Parameter.objects.create(
                        chart=self.chart,
                        name='start_date',
                        data_type='date',
                        mandatory=True,
                        type=1
                        )

    def _chart_post_api(self, params):
        response = self.client.post('/squealy/' + self.chart.url + '/',
                                    json.dumps({'params': params}),
                                    content_type="application/json"
                                    )
        return response

    def _chart_get_api(self, params):
        return self.client.get('/squealy/' + params)

    def test_chart_get_api(self):
        response = self._chart_get_api('?start_date=2016-03-06')
        self.assertEqual(response.status_code, 200)

    def test_chart_post_api(self):
        response = self._chart_post_api({'start_date': '2016-03-06'})
        self.assertEqual(200, response.status_code)
        self.assertEqual(response.json(), {
                                            u'data': [
                                                      [u'test1', 2, 4],
                                                      [u'test2', 10, 4],
                                                      [u'test3', 6, 9],
                                                      [u'test4', 15, 7],
                                                      [u'test5', 15, 10]],
                                            u'columns': [u'name', u'experience',
                                                         u'salary']
                                           })

    def test_exception(self):
        response = self._chart_post_api({})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {u'error': u'Parameter required: start_date'})

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

