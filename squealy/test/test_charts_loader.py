import json

from django.contrib.auth.models import Permission, ContentType, User

from .test_base_file import BaseTestCase
from squealy.models import Chart


class ChartLoaderTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.setUp(self)
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_mock_client(self)
        BaseTestCase.create_schema(self)
        self.chart = BaseTestCase.create_chart(self)
        content_type = ContentType.objects.get_for_model(Chart)
        self.edit_perm = Permission.objects.create(
                id=None,
                codename='can_edit_' + str(self.chart.id),
                name='Can edit ' + self.chart.url,
                content_type=content_type,
            )
        self.edit_perm.save()

    def _charts_get_api(self):
        return self.client.get('/charts/')

    def _chart_delete_api(self, id):
        return self.client.delete('/charts/', json.dumps({'id': id}),
                                  content_type="application/json")

    def test_edit_permission(self):
        response = self._charts_get_api()
        self.assertEqual(response.status_code, 200)
        edit_permission = [d['can_edit'] for d in response.json() if d['url'] == self.chart.url][0]
        self.assertEqual(edit_permission, True)

    def test_chart_deletion(self):
        response = self._chart_delete_api(1)
        self.assertEqual(response.status_code, 200)

    def test_delete_exception(self):
        response = self._chart_delete_api('37')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(),
                         {u'detail': u'A chart with id 37 was not found'})

    def tearDown(self):
        BaseTestCase.delete_schema(self)
