from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres import fields


class Account(models.Model):
    """
    This model holds the enterprise level accounts containing charts. This would be populated by the admin user.
    """
    name = models.CharField(max_length=250)

    def __unicode__(self):
        return self.name


class Chart(models.Model):
    """
    This represents an API for generating a chart or report.
    """
    account = models.ForeignKey(Account, null=True, blank=True)
    url = models.CharField(max_length=2000)
    query = models.TextField()
    name = models.CharField(max_length=50)  # To be updated to be in sync with the authoring interface UI.
    format = models.CharField(max_length=50,
                              default="SimpleFormatter")  # To accommodate custom formatting function paths too.
    type = models.CharField(max_length=20, default="ColumnChart")
    options = fields.JSONField(null=True, blank=True)

    def __unicode__(self):
        return self.name + "( /" + self.url + ")"


class ChartColumn(models.Model):
    """
    This represents a column definition for a chart
    """
    TYPE_CHOICES = [(1, 'dimension'), (2, 'metric')]

    chart = models.ForeignKey(Chart)
    name = models.CharField(max_length=50)
    type = models.IntegerField(default=1, choices=TYPE_CHOICES)

    def __unicode__(self):
        return self.name


class ChartParameter(models.Model):
    """
    This represents a parameter injected in the query
    """
    TYPE_CHOICES = [(1, 'query'), (2, 'user')]

    chart = models.ForeignKey(Chart)
    name = models.CharField(max_length=100)
    data_type = models.CharField(max_length=100, default='string')
    mandatory = models.BooleanField(default=True)
    default_value = models.CharField(max_length=200, null=True, blank=True)
    type = models.IntegerField(default=1, choices=TYPE_CHOICES)

    def __unicode__(self):
        return self.name


class Transformation(models.Model):
    """
    This represents the transformations that are applied after retrieving the data from the query.
    """

    chart = models.ForeignKey(Chart)
    name = models.CharField(max_length=100)
    kwargs = fields.JSONField()

    def __unicode__(self):
        return self.name


class Validation(models.Model):
    """
    This represents API Validations
    """

    chart = models.ForeignKey(Chart)
    query = models.TextField()

    def __unicode__(self):
        return self.name
