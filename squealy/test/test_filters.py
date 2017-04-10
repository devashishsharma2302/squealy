from .test_base_file import BaseTestCase


class FiltersTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.setUp(self)
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_mock_client(self)
        BaseTestCase.create_schema(self)
        self.filter = BaseTestCase.create_filter(self)

    def _filter_get_api(self, filter_url):
        response = self.client.get('/filter/' + filter_url + '/?payload=%7B"format"%3A"GoogleChartsFormatter"%7D')
        return {
            "response": response.json(),
            "status_code": response.status_code
        }

    def test_filter_api(self):
        """
            Check if the filter API returns list of filters
        """
        response_details = self._filter_get_api(self.filter.url)
        self.assertEqual(200, response_details['status_code'], response_details['response'])
        self.assertEqual(response_details['response'], {
            u'rows': [{u'c': [{u'v': u'test1'}]}, {u'c': [{u'v': u'test2'}]},
                      {u'c': [{u'v': u'test2'}]}, {u'c': [{u'v': u'test3'}]},
                      {u'c': [{u'v': u'test3'}]}, {u'c': [{u'v': u'test1'}]},
                      {u'c': [{u'v': u'test5'}]}, {u'c': [{u'v': u'test4'}]},
                      {u'c': [{u'v': u'test4'}]}, {u'c': [{u'v': u'test5'}]}],
            u'cols': [{u'type': u'string', u'id': u'name', u'label': u'name'}]
        })

    def test_filternotfound_exception(self):
        """
            Check if an exception is raised if a filter does not
            exists with a given URL
        """
        response_details = self._filter_get_api('random_url')
        self.assertEqual(400, response_details['status_code'], response_details['response'])
        self.assertEqual(response_details['response'],
                         {u'detail': u'Filter with url - random_url not found'}
                         )

    def test_databasenotselected_exception(self):
        """
            Check if no database is selected then an exception is raised
        """
        self.filter.database = None
        self.filter.save()
        response_details = self._filter_get_api(self.filter.url)
        self.assertEqual(400, response_details['status_code'], response_details['response'])
        self.assertEqual(response_details['response'],
                         {u'detail': u'Database is not selected'}
                         )
