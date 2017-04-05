from rest_framework import status
from rest_framework.exceptions import APIException


class RequiredParameterMissingException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class DateParseException(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    pass


class DateTimeParseException(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    pass


class NumberParseException(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    pass


class ValidationFailedException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    pass


class ChartNotFoundException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class FilterNotFoundException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class MalformedChartDataException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class TransformationException(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    pass


class DatabaseWriteException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class InvalidDateRangeException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class DuplicateUrlException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class SMTPException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class EmailRecipientException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class EmailSubjectException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class DatabaseConfigurationException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass


class SelectedDatabaseException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    pass