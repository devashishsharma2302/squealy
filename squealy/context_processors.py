from django.conf import settings


def google_oauth(request):
    """
        Returns True if Google OAUTH configuration is
        defined in the environment
    """
    return {
        'GOOGLE_OAUTH_CONFIGURED': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY and
        settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
    }

