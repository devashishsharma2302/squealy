import datetime
from django.db import connection

from squealy.models import Chart
from .test_base_file import BaseTestCase
from dateutil.relativedelta import relativedelta


class JinjaSqlMacrosTest(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_mock_client(self)
        self.create_schema()
        self.chart = Chart.objects.create(url='testing-macros',
                                          query="""
                                            {% import 'utils.sql' as utils %}
                                            select name, date_of_joining
                                            from employees
                                            where {{utils.date_range('date_of_joining', 'last_3_days')}};
                                            """,
                                          name='Testing JinjaSQL Macros',format='SimpleFormatter',
                                          type='ColumnChart',
                                          database='default')

    def create_schema(self):
        """
        This method creates an employee table which has four columns:
        name, experience, date of joining and salary
        After creating the table, we populate it with
        """
        with connection.cursor() as c:
            query = 'CREATE TABLE employees (name VARCHAR(5), experience INT,date_of_joining DATE, salary INT)'
            today = datetime.date.today()

            values_list = [

                # Insert 3 entries within last 3 days
                ["test1", 2, today + relativedelta(days=-1), 4],
                ["test2", 5, today + relativedelta(days=-2), 4],
                ["test3", 2, today, 4],

                # Insert 3 entries within last week
                ["test1", 2, today + relativedelta(days=-3), 4],
                ["test2", 5, today + relativedelta(days=-5), 4],
                ["test3", 2, today + relativedelta(days=-4), 4],

                # Insert 3 entries within last month
                ["test1", 2, today + relativedelta(days=-25), 4],
                ["test2", 5, today + relativedelta(days=-10), 4],
                ["test3", 2, today + relativedelta(days=-25), 4],

                # Insert 3 entries within last 3 months
                ["test1", 2, today + relativedelta(months=-2), 4],
                ["test2", 5, today + relativedelta(months=-1), 4],
                ["test3", 2, today + relativedelta(days=-20), 4],

                # Insert 3 entries within last 6 months
                ["test1", 2, today + relativedelta(months=-2), 4],
                ["test2", 5, today + relativedelta(months=-4), 4],
                ["test3", 2, today + relativedelta(months=-5), 4],

                # Insert 3 entries within last year
                ["test1", 2, today + relativedelta(months=-8), 4],
                ["test2", 5, today + relativedelta(months=-10), 4],
                ["test3", 2, today + relativedelta(years=-1), 4]
            ]
            c.execute(query)
            for value in values_list:
                query1 = 'INSERT INTO employees VALUES('+`str(value[0])`+','+`value[1]`+','+`str(value[2])`+','+`value[3]`+')'
                c.execute(query1)

    def run_date_range_query(self, range):
        self.chart.query = """
                {% import 'utils.sql' as utils %}
                select name, date_of_joining
                from employees
                where {{utils.date_range('date_of_joining', '""" + range + """')}};
                """
        self.chart.save()
        response = self.client.get('/squealy/' + self.chart.url + '/')
        return response

    def test_date_range(self):

        test_ranges = [('last_3_days', 3), ('last_week', 6),
                       ('last_month', 11), ('last_quarter', 13),
                       ('last_half', 15), ('last_year', 18)]

        for range in test_ranges:
            response = self.run_date_range_query(range[0])
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data['data']), range[1])

    def tearDown(self):
        Chart.objects.all().delete()
        with connection.cursor() as c:
            query = "DROP TABLE employees"
            c.execute(query)


