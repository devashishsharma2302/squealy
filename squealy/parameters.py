import arrow

from squealy.exceptions import DateParseException, DateTimeParseException


class Parameter():
    def __init__(self):
        pass

    def to_internal(self, value):
        return value


class String(Parameter):
    def __init__(self, name, description=None, default_value=None, valid_values=None):
        self.default_value = None
        self.valid_values = valid_values
        self.name = name
        self.description = description if description else ""

    def to_internal(self, value):
        if isinstance(value, str):
            return value
        else:
            return str(value)

    def is_valid(self, value):
        if not self.valid_values:
            return True
        if value in self.valid_values:
            return True
        return False


class Date(Parameter):
    def __init__(self, name, description=None, default_value=None, format=None):
        self.default_value = default_value
        self.format = format
        self.name = name
        self.description = description if description else ""

    def to_internal(self, value):
        try:
            if value.lower() == "today":
                date = arrow.utcnow()
                return date.date()
            else:
                date = arrow.get(value, self.format)
                return date.date()
        except arrow.parser.ParserError:
            if self.format:
                raise DateParseException("Date could not be parsed: Expected Format- "+self.format+", Received value - "
                                         + value)
            else:
                raise DateParseException("Invalid date: " + value)
        except ValueError as err:
            raise DateParseException(err[0] + ", Received Value - " + value)


class Datetime(Parameter):
    def __init__(self, name, description=None, default_value=None, format=None):
        self.default_value = default_value
        self.format = format
        self.name = name
        self.description = description if description else ""

    def to_internal(self, value):
        try:
            if value.lower() == "now":
                date = arrow.utcnow()
                return date.datetime
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
