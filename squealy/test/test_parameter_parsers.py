from django.test import TestCase

from squealy.parameters import String, Date, Datetime, Number
from squealy.exceptions import NumberParseException


class ParameterParserTestCase(TestCase):

    def setUp(self):
        self.string_parser = String('string_parser')
        self.number_parser = Number('number_parser')

    def test_string_parser(self):
        self.assertEqual(self.string_parser.to_internal('Led Zeppelin'), 'Led Zeppelin')
        self.assertEqual(self.string_parser.to_internal(3), '3')
        self.assertEqual(self.string_parser.is_valid('Led Zeppelin'), True)
        self.string_parser = String('test', None, None, ['Led', 'Zeppelin'])
        self.assertEqual(self.string_parser.is_valid('Led Zeppelin'), False)
        self.assertEqual(self.string_parser.is_valid('Led'), True)

    def test_number_parsing(self):
        self.assertEqual(self.number_parser.to_internal('1'), 1)
        self.assertEqual(type(self.number_parser.to_internal('1')), int)
        self.assertEqual(self.number_parser.to_internal('1.2'), 1.2)
        self.assertEqual(type(self.number_parser.to_internal('1.2')), float)
        with self.assertRaises(NumberParseException):
            self.number_parser.to_internal('Led Zeppelin')
