from django.db import models

class MarketDynamic(models.Model):
    """
        Stores the parameter and its values for every scheduled report
    """
    country = models.CharField(max_length=100)
    format = models.CharField(max_length=100)
    year = models.IntegerField()
    value = models.FloatField()
    volume = models.FloatField()
    total_value = models.FloatField()
    total_volume = models.FloatField()

class MarketKPI(models.Model):
    country = models.CharField(max_length=100)
    quarter = models.CharField(max_length=100)
    kpi = models.FloatField()

class ExecutionKPI(models.Model):
    country = models.CharField(max_length=100)
    year = models.IntegerField()
    quarter = models.CharField(max_length=100)
    aware = models.FloatField()
    not_aware = models.FloatField()
    criteria = models.IntegerField(default=1)
