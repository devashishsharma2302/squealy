import os

import jwt
from django.contrib.auth import login
from django.contrib.auth.models import User, Group


class JWTAuthentication(object):
    """
    Middleware class to authenticate and log in a user with details present in the jwt token.
    """
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        token = self._extract_token(request)
        if not request.user.is_authenticated() and token:
            user = self._authenticate(token)
            if user:
                login(request, user)
                request.user = user
        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    def _authenticate(self, token):
        """"
        Decode the jwt token and return the user. Create new user if the user does not exist already.
        Add the user to groups that are provoded in the jwt token.
        """
        try:
            jwt_key = os.environ.get('JWT_KEY')
            token_params = jwt.decode(token, jwt_key, algorithms=['HS256'])
            user_name = token_params['username']
            user = User.objects.filter(username=user_name).first()
            if not user:
                user = User(username=user_name)
                user.save()

            groups = token_params.get('groups', [])
            for group_name in groups:
                group_object = Group.objects.filter(name=group_name).first()
                if group_object:
                    group_object.user_set.add(user)
            return user
        except (jwt.InvalidTokenError, KeyError):
            return None

    def _extract_token(self, request):
        """
        To extract the access token from the request.
        Assumption - The token is passed in key - 'accessToken'
        """
        if request.method == 'GET':
            return request.GET.get('accessToken')
        elif request.method == 'POST':
            return request.POST.get('accessToken')
        return None

