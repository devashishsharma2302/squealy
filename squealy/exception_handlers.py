class NoQueryException(Exception):
    pass


class RequiredParameterMissingException(Exception):
    pass


class DateParseException(Exception):
    pass


class DateTimeParseException(Exception):
    pass


class ValidationFailedException(Exception):
    pass