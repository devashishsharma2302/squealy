from django.db import transaction

from .test_base_file import BaseTestCase


class UserInfoTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_mock_client(self)

    def test_userinfo_api(self):
        response = self.client.get('/user/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            u'first_name': u'',
            u'last_name': u'',
            u'name': u'foo',
            u'can_delete_chart': True,
            u'isAdmin': True,
            u'can_add_chart': True,
            u'email': u''
        })