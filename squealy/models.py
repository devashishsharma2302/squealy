from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres import fields

from datetime import datetime
from croniter import croniter

from .constants import TRANSFORMATION_TYPES, PARAMETER_TYPES, COLUMN_TYPES
import json

class CustomJSONField(models.TextField):

    def from_db_value(self, value, expression, connection, context):
        if value is None:
            return {}
        elif isinstance(value, basestring):
            return json.loads(value)
        else:
            return value

    def get_prep_value(self, value):
        return json.dumps(value)

    def to_python(self, value):
        if value is None:
            return {}
        elif isinstance(value, basestring):
            return json.loads(value)
        else:
            return value


class Account(models.Model):
    """
    This model holds the enterprise level accounts containing charts.
    This would be populated by the admin user.
    """
    name = models.CharField(max_length=250)

    def __unicode__(self):
        return self.name


class Chart(models.Model):
    """
    This represents an API for generating a chart or report.
    """
    account = models.ForeignKey(Account, null=True, blank=True)
    url = models.CharField(max_length=255, unique=True)
    query = models.TextField()
    # To be updated to be in sync with the authoring interface UI.
    name = models.CharField(max_length=255)
    # To accommodate custom formatting function paths too.
    format = models.CharField(max_length=50,
                              default="GoogleChartsFormatter")
    type = models.CharField(max_length=20, default="ColumnChart")
    options = CustomJSONField(null=True, blank=True, default={})
    database = models.CharField(max_length=100, null=True, blank=True)

    def __unicode__(self):
        return self.name + "( /" + self.url + ")"


class Filter(models.Model):
    """
    This represents an API for generating a dropdown filter.
    """
    url = models.CharField(max_length=255, unique=True)
    query = models.TextField()
    # To be updated to be in sync with the authoring interface UI.
    name = models.CharField(max_length=255)
    database = models.CharField(max_length=100, null=True, blank=True)

    def __unicode__(self):
        return self.name + "( /" + self.url + ")"


class Parameter(models.Model):
    """
    This represents a parameter injected in the query
    """

    chart = models.ForeignKey(Chart, related_name='parameters')
    name = models.CharField(max_length=100)
    data_type = models.CharField(max_length=100, default='string')
    mandatory = models.BooleanField(default=True)
    default_value = models.CharField(max_length=200, null=True, blank=True)
    test_value = models.CharField(max_length=200, null=True, blank=True)
    type = models.IntegerField(default=1, choices=PARAMETER_TYPES)
    order = models.IntegerField(null=True, blank=True)
    kwargs = CustomJSONField(null=True, blank=True, default={})
    dropdown_api = models.CharField(max_length=255, null=True, blank=True)
    is_parameterized = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name


class FilterParameter(models.Model):
    """
    This represents a parameter injected in the filter query
    """
    filter = models.ForeignKey(Filter, related_name='parameters')
    name = models.CharField(max_length=100)
    default_value = models.CharField(max_length=200, null=True, blank=True)
    test_value = models.CharField(max_length=200, null=True, blank=True)

    def __unicode__(self):
        return self.name


class Transformation(models.Model):
    """
    This represents the transformations that are applied after retrieving
    the data from the query.
    """

    chart = models.ForeignKey(Chart, related_name='transformations')
    name = models.IntegerField(default=1, choices=TRANSFORMATION_TYPES)
    kwargs = CustomJSONField(null=True, blank=True, default={})

    def __unicode__(self):
        return TRANSFORMATION_TYPES[self.name-1][1]


class Validation(models.Model):
    """
    This represents API Validations
    """

    chart = models.ForeignKey(Chart, related_name='validations')
    query = models.TextField()
    name = models.CharField(max_length=200)

    def __unicode__(self):
        return self.chart.name


class ScheduledReport(models.Model):
    """
        Contains email subject and junctures when the email has to be send
    """

    subject = models.CharField(max_length=200)
    last_run_at = models.DateTimeField(null=True, blank=True)
    next_run_at = models.DateTimeField(null=True, blank=True)
    cron_expression = models.CharField(max_length=200)
    template = models.TextField(
                null=True, blank=True,
                help_text="Add '{% include 'report.html' %}' to include your reports in mail")

    def save(self, *args, **kwargs):
        """
        function to evaluate "next_run_at" using the cron expression
        """
        self.last_run_at = datetime.now()
        iter = croniter(self.cron_expression, self.last_run_at)
        self.next_run_at = iter.get_next(datetime)
        super(ScheduledReport, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.subject


class ScheduledReportChart(models.Model):
    """
        Many to many mapping between charts and cheduled reports
    """

    chart = models.ForeignKey(Chart, related_name='scheduledreportchart')
    report = models.ForeignKey(ScheduledReport,
                               related_name='relatedscheduledreport')


class ReportRecipient(models.Model):
    """
        Stores all the recepeints of the given reports
    """

    email = models.EmailField()
    report = models.ForeignKey(ScheduledReport, related_name='reportrecep')


class ReportParameter(models.Model):
    """
        Stores the parameter and its values for every scheduled report
    """

    parameter_name = models.CharField(max_length=300)
    parameter_value = models.CharField(max_length=300)
    report = models.ForeignKey(ScheduledReport, related_name='reportparam')

