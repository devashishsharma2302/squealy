import arrow

from squealy.exception_handlers import DateParseException, DateTimeParseException


class StringParameter:
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


class DateParameter:
    def __init__(self, name, description=None, default_value=None, format=None, output_format=None):
        self.default_value = default_value
        self.format = format
        self.name = name
        self.description = description if description else ""
        self.output_format = output_format

    def to_internal(self, value):
        try:
            if (value.lower() == "today"):
                date = arrow.utcnow()
                if self.output_format:
                    return date.format(self.output_format)
                return str(date.date())
            else:
                date = arrow.get(value, self.format)
                if self.output_format:
                    return date.format(self.output_format)
                return str(date.date())
        except arrow.parser.ParserError:
            if self.format:
                raise DateParseException("Date could not be parsed:\
                                         Received value - " + value +
                                         "Expected Format - "+self.format)
            else:
                raise DateParseException("Invalid date", value)


class DateTimeParameter:
    def __init__(self, name, description=None, default_value=None, format=None, output_format=None):
        self.default_value = default_value
        self.format = format
        self.name = name
        self.description = description if description else ""
        self.output_format = output_format

    def to_internal(self, value):
        try:
            if value.lower() == "now":
                date = arrow.utcnow()
                if self.output_format:
                    return date.format(self.output_format)
                return str(date.format())
            else:
                date = arrow.get(value, self.format)
                if self.output_format:
                    return date.format(self.output_format)
                return str(date.format())
        except arrow.parser.ParserError:
            if self.format:
                raise DateTimeParseException("DateTime could not be parsed:\
                                         Received value - " + value +
                                         "Expected Format - "+self.format)
            else:
                raise DateTimeParseException("Invalid DateTime", value)