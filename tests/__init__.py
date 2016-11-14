import unittest
from tests.test_views import SqlApiViewTest

def all_tests():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(SqlApiViewTest))
    return suite
