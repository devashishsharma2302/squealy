import jwt
from .test_base_file import BaseTestCase
from squealy.models import Chart
from django.test import Client
from test.test_support import EnvironmentVarGuard


class JWTAuthenticationTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_schema(self)
        self.client = Client()
        self.env = EnvironmentVarGuard()
        self.env.set('JWT_KEY', 'secret')

    def test_redirection_to_login_for_unauthenticated_requests(self):
        with self.env:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 302)
            self.assertTrue(response.url.startswith('/login'))

    def test_login_with_jwt(self):
        with self.env:
            token = jwt.encode({'username': 'foo'}, 'secret', algorithm='HS256')
            response = self.client.get('/' + '/?accessToken=' + token)
            self.assertEqual(response.status_code, 200)

    def tearDown(self):
        BaseTestCase.delete_schema(self)

