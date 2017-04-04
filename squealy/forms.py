from datetime import datetime

from croniter import croniter
from django.forms import ModelForm, ValidationError

from models import ScheduledReport
from squealy.widgets import HtmlEditor


class ScheduledReportForm(ModelForm):
    class Meta:
        model = ScheduledReport
        fields = ['subject', 'cron_expression']
        fields = ['subject', 'template', 'cron_expression']
        help_texts = {'cron_expression': 'Scheduled time is considered in UTC'}
        widgets = {
            'template': HtmlEditor()
        }

    def clean(self):
        cleaned_data = super(ScheduledReportForm, self).clean()
        cron_expression = cleaned_data.get("cron_expression")
        try:
            iter = croniter(cron_expression, datetime.now())
        except:
            raise ValidationError("Incorrect cron expression:\
            The information you must include is (in order of appearance):\
            A number (or list of numbers, or range of numbers), m, representing the minute of the hour\
            A number (or list of numbers, or range of numbers), h, representing the hour of the day\
            A number (or list of numbers, or range of numbers), dom, representing the day of the month\
            A number (or list, or range), or name (or list of names), mon, representing the month of the year\
            A number (or list, or range), or name (or list of names), dow, representing the day of the week\
            The asterisks (*) in our entry tell cron that for that unit of time, the job should be run every.\
            Eg. */5 * * * * cron for executing every 5 mins")
        return cleaned_data