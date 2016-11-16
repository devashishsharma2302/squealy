class NoQueryException(Exception):
    pass


class RequiredParameterMissingException(Exception):
    pass


class DateParseException(Exception):
    pass


class InvalidJWTException(Exception):
    pass


class PermissionDeniedException(Exception):
    pass
