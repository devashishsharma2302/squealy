import datetime

from squealy.parameters import Parameter
import arrow
from squealy.exceptions import DateTimeParseException

class CustomDatetime(Parameter):
    def __init__(self, name, description=None, default_value=None, format=None):
        self.default_value = default_value
        self.format = format
        self.name = name
        self.description = description if description else ""

    def to_internal(self, value):
        try:
            if value.lower() == "yesterday":
                date = arrow.utcnow()
                return date.datetime - datetime.timedelta(days=1)
            else:
                date = arrow.get(value, self.format)
                return date.datetime
        except arrow.parser.ParserError:
            if self.format:
                raise DateTimeParseException("Datetime could not be parsed: Expected Format - "+self.format
                                             + ", Received value - " + value)
            else:
                raise DateTimeParseException("Invalid DateTime: " + value)
        except ValueError as err:
                raise DateTimeParseException(err[0]+" Recieved Value - " + value)
