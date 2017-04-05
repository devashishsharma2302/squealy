from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.db import connection
from squealy.models import Chart, Filter


class BaseTestCase(TestCase):

    def create_mock_user(self):
        user = User.objects.create(username="foo")
        user.set_password('baz')
        user.is_superuser = True
        user.save()
        self.user = user

    def create_mock_client(self):
        self.client = Client()
        self.client.login(username="foo", password="baz")

    def create_schema(self):
        """
        This method creates an employee table which has four columns:
        name, experience, date of joining and salary
        After creating the table, we populate it with
        """
        with connection.cursor() as c:
            query = 'CREATE TABLE employee_db (name VARCHAR(5), experience INT, date_of_joining DATE, salary INT)'
            values_list = [
                         ["test1", 2, "2016-01-01", 4],
                         ["test2", 4, "2016-02-01", 3],
                         ["test2", 6, "2016-02-03", 1],
                         ["test3", 4, "2016-01-01", 7],
                         ["test3", 2, "2016-03-04", 2],
                         ["test1", 3, "2016-03-06", 7],
                         ["test5", 6, "2016-03-01", 3],
                         ["test4", 7, "2016-02-01", 5],
                         ["test4", 8, "2016-02-01", 2],
                         ["test5", 9, "2016-01-04", 7]
                        ]
            c.execute(query)
            for value in values_list:
                query1 = 'INSERT INTO employee_db VALUES('+`str(value[0])`+','+`value[1]`+','+`str(value[2])`+','+`value[3]`+')'
                c.execute(query1)

    def create_chart(self):
        chart = Chart.objects.create(
            url='dgchart',
            query='select name,sum(experience) as experience,sum(salary) as salary from employee_db group by name;',
            name='dgchart', format='SimpleFormatter', type='ColumnChart',
            database='default')
        return chart

    def create_filter(self):
        filter = Filter.objects.create(
            url='emp-name', query='select name from employee_db',
            name='Employee Dropdown', database='default')
        return filter

    def delete_schema(self):
        with connection.cursor() as c:
            query = "DROP TABLE employee_db"
            c.execute(query)

