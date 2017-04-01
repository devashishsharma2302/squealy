# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-03-31 06:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import squealy.models


class Migration(migrations.Migration):

    dependencies = [
        ('squealy', '0003_merge_20170330_1334'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScheduledReportChart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.RemoveField(
            model_name='scheduledreport',
            name='chart',
        ),
        migrations.AlterField(
            model_name='chart',
            name='options',
            field=squealy.models.CustomJSONField(blank=True, default={}, null=True),
        ),
        migrations.AlterField(
            model_name='scheduledreport',
            name='template',
            field=models.TextField(blank=True, help_text="Add '{% include 'report.html' %}' to include your reports in mail", null=True),
        ),
        migrations.AddField(
            model_name='scheduledreportchart',
            name='chart',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scheduledreportchart', to='squealy.Chart'),
        ),
        migrations.AddField(
            model_name='scheduledreportchart',
            name='report',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='relatedscheduledreport', to='squealy.ScheduledReport'),
        ),
    ]