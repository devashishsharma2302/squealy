import arrow
import datetime

from .exceptions import DateParseException, DateTimeParseException, NumberParseException


class Parameter():
    def __init__(self):
        pass

    def to_internal(self, value):
        return value


class String(Parameter):
    def __init__(self, name, description=None, default_value=None, valid_values=None):
        self.default_value = default_value
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
        self.date_macros = {"today": self.today, "tomorrow": self.tomorrow,
                       "next_day": self.tomorrow, "current_day": self.today}

    def today(self, value):
        date = arrow.utcnow()
        return date.date()

    def tomorrow(self, value):
        date = arrow.utcnow()+datetime.timedelta(days=1)
        return date.date()

    def default_formatter(self, value):
        if self.format:
            date = arrow.get(value, self.format)
            return date.date()
        else:
            date = arrow.get(value)
            return date.date()

    def to_internal(self, value):
        try:
            value = value.lower()
            date = self.date_macros.get(value, self.default_formatter)(value)
            return date
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
        self.datetime_macros = {"today": self.now, "now": self.now}
        self.default_value = default_value
        self.format = format
        self.name = name
        self.description = description if description else ""

    def now(self, value):
        date = arrow.utcnow()
        return date.datetime

    def default_formatter(self, value):
        if self.format:
            date = arrow.get(value, self.format)
            return date.datetime
        else:
            date = arrow.get(value)
            return date.datetime

    def to_internal(self, value):
        try:
            value = value.lower()
            date_time = self.datetime_macros.get(value, self.default_formatter)(value)
            return date_time
        except arrow.parser.ParserError:
            if self.format:
                raise DateTimeParseException("Datetime could not be parsed: Expected Format - "+self.format
                                             + ", Received value - " + value)
            else:
                raise DateTimeParseException("Invalid DateTime: " + value)
        except ValueError as err:
                raise DateTimeParseException(err[0]+" Recieved Value - " + value)

class Number(Parameter):
    def __init__(self, name, description=None, default_value=None, valid_values=None):
        self.default_value = default_value
        self.valid_values = valid_values
        self.name = name
        self.description = description if description else ""

    def to_internal(self, value):
        try:
            if value.isdigit():
                return int(value)
            else :
                return float(value)
        except ValueError:
            raise NumberParseException("Cannot parse to int or float"+ value)