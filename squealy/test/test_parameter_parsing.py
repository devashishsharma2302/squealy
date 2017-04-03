from .test_base_file import BaseTestCase
from squealy.models import Parameter


class ParametersTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.setUp(self)
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_mock_client(self)
        BaseTestCase.create_schema(self)
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

    def _chart_get_api(self, url, parameters):
        response = self.client.get('/squealy/' + url + '/' + parameters)
        return {
            "response": response.json(),
            "status_code": response.status_code
        }

    def test_parameter_parsing(self):
        """
            Checks if the parameters are parsed correctly
        """
        response_details = self._chart_get_api(self.chart.url, '?' + self.parameter.name + '=2016-03-06')
        self.assertEqual(200, response_details['status_code'], response_details)
        self.assertEqual(response_details['response'], {
                                            u'data': [[u'test1', 2, 4],
                                                      [u'test2', 10, 4],
                                                      [u'test3', 6, 9],
                                                      [u'test4', 15, 7],
                                                      [u'test5', 15, 10]],
                                            u'columns': [
                                                         u'name',
                                                         u'experience',
                                                         u'salary']})

    def test_mandatory_parameter(self):
        """
            Checks if exception is raised if a mandatory parameter is absent
        """
        response_details = self._chart_get_api(self.chart.url, '')
        self.assertEqual(400, response_details['status_code'])
        self.assertEqual(response_details['response'], {u'detail': u'Parameter required: start_date'})

    def tearDown(self):
        BaseTestCase.delete_schema(self)
        self.parameter.delete()
