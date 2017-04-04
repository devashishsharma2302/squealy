from datetime import datetime, timedelta

from django.core.mail import send_mail
from django.template import Template, Context
from django.http import HttpResponse

from django.conf import settings

from .models import ScheduledReport, ScheduledReportChart,\
                           ReportParameter, ReportRecipient
from .exceptions import SMTPException, EmailRecipientException, EmailSubjectException
from .views import DataProcessor


def check_smtp_credentials():
    """
        This method checks if the user has provided the SMTP credentials or not
    """
    return hasattr(settings, 'EMAIL_HOST') and hasattr(settings, 'EMAIL_PORT')\
        and hasattr(settings, 'EMAIL_HOST') and\
        hasattr(settings, 'EMAIL_HOST_USER') and hasattr(settings, 'EMAIL_HOST_PASSWORD')


class ScheduledReportConfig(object):

    def __init__(self, scheduled_report):
        """
            Expects a scheduled report object and inititializes
            its own scheduled_report attribute with it
        """
        self.scheduled_report = scheduled_report

    def get_report_config(self):
        """
            Returns the configuration related to a scheduled report, needed
            to populate the email
        """
        return {
                "template_context": self._get_related_charts_data(),
                "recipients": self._get_report_recipients()
                }

    def _get_report_recipients(self):
        """
            Returns the recipient list for a scheduled report
        """
        return list(ReportRecipient.objects.filter(report=self.scheduled_report)\
                    .values_list('email', flat=True))

    def _get_report_parameters(self):
        """
            Returns the query parameters for a scheduled report
        """
        report_parameters = ReportParameter.objects.\
            filter(report=self.scheduled_report)

        param_dict = {}

        for parameter in report_parameters:
            param_dict[parameter.parameter_name] = parameter.parameter_value

        return param_dict

    def _get_related_charts_data(self):
        """
            Returns the data needed to populate the reports
            mapped with a scheduled report
        """
        related_charts_data = {
            "charts": []
        }

        filtered_scheduled_reports = ScheduledReportChart.objects.\
            filter(report=self.scheduled_report)
        report_parameters = self._get_report_parameters()

        for report in filtered_scheduled_reports:
            chart_data = DataProcessor().\
                fetch_chart_data(report.chart.url, report_parameters, None)
            related_charts_data['charts'].append(
                {
                    "data": chart_data,
                    "name": report.chart.name
                }
            )

        return related_charts_data


def create_email_data(content=None):
    if not content: content = "{% include 'report.html' %}"
    content = '''
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
        </head>
        <body> ''' + str(content) + '''</body></html>'''
    return content


def send_emails():
    if check_smtp_credentials():
        current_time = datetime.utcnow()
        scheduled_reports = ScheduledReport.objects.filter(next_run_at__range=(current_time + timedelta(minutes=-1), current_time))
        # TODO: Try to reduce the db queries here
        for scheduled_report in scheduled_reports:
            report_config = ScheduledReportConfig(scheduled_report).\
                get_report_config()
            template = Template(create_email_data(scheduled_report.template))
            report_template = template.render(Context(report_config['template_context']))
            scheduled_report.save()
            if not scheduled_report.subject:
                raise EmailSubjectException('Subject not provided for scheduled report %s' % scheduled_report.id)
            if not report_config['recipients']:
                raise EmailRecipientException('Recipients not provided for scheduled report %s' % (scheduled_report.id))
            send_mail(
                scheduled_report.subject, 'Here is the message.',
                settings.EMAIL_HOST_USER, report_config['recipients'],
                fail_silently=False, html_message=report_template
            )
    else:
        raise SMTPException('Please specify the smtp credentials to use the scheduled reports service')
