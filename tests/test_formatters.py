from .test_base_file import BaseTestCases
from squealy.models import Chart



class FormattersTestCase(BaseTestCases):
    def setUp(self):
        BaseTestCases.create_mock_user(self)
        BaseTestCases.create_mock_client(self)
        BaseTestCases.create_schema(self)
        self.chart = BaseTestCases.create_chart(self)

    def test_hi(self):
        print ('hello bro')
        self.assertEqual(200,200)

    def test_simple_formatter(self):
        response = self.client.get('/squealy/' + self.chart.name + '/')
        json_response = response.json()
        self.assertEqual(json_response,{u'data': [[u'test3', 6, 9], [u'test4', 15, 7], [u'test2', 10, 4], [u'test1', 5, 11], [u'test5', 15, 10]], u'columns': [u'name', u'experience', u'salary']})


    def test_google_charts_formatter(self):
        self.chart.format = "GoogleChartsFormatter"
        self.chart.save()
        response = self.client.get('/squealy/' + self.chart.name + '/')
        json_response = response.json()
        self.assertEqual(json_response,{u'rows': [{u'c': [{u'v': u'test3'}, {u'v': 6}, {u'v': 9}]}, {u'c': [{u'v': u'test4'}, {u'v': 15}, {u'v': 7}]}, {u'c': [{u'v': u'test2'}, {u'v': 10}, {u'v': 4}]}, {u'c': [{u'v': u'test1'}, {u'v': 5}, {u'v': 11}]}, {u'c': [{u'v': u'test5'}, {u'v': 15}, {u'v': 10}]}], u'cols': [{u'type': u'string', u'id': u'name', u'label': u'name'}, {u'type': u'number', u'id': u'experience', u'label': u'experience'}, {u'type': u'number', u'id': u'salary', u'label': u'salary'}]})

    def tearDown(self):
        Chart.objects.all().delete()
        BaseTestCases.delete_schema(self)

