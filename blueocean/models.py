from django.db import models


class MarketDynamic(models.Model):
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


class SharePerBrand(models.Model):
    country = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    value2014 = models.FloatField()
    value2015 = models.FloatField()


class SharePerCompany(models.Model):
    country = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    value2014 = models.FloatField()
    value2015 = models.FloatField()