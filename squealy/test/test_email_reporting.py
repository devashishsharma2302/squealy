from .test_base_file import BaseTestCase
from squealy.models import Chart, ScheduledReport,ScheduledReportChart, ReportRecipient
from datetime import datetime, timedelta
from squealy.email_service import *

from django.conf import settings
import django.core.mail as mail


class  EmailReportTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_schema(self)
        BaseTestCase.create_mock_client(self)
        self.chart = BaseTestCase.create_chart(self)
        test_html = '''
            <div>
                <p> Ram ram </p>
                {% include 'report.html' %}
            <div>
        '''
        self.chart.format = "GoogleChartsFormatter"
        self.chart.save()
        self.report = ScheduledReport(subject='Test subject 1',cron_expression = '* * * * *', template=test_html)
        self.report.save()
        self.recipient = ReportRecipient(email='test1@test1.com',report=self.report)
        self.recipient.save()
        self.scheduledReport = ScheduledReportChart(chart=self.chart,report=self.report)
        self.scheduledReport.save()

    def test_email(self):
        send_emails()
        content = [(u'\n    <!DOCTYPE html>\n        <html lang="en">\n        <head>\n            <meta charset="UTF-8">\n            <title>Title</title>\n        </head>\n        <body> \n            <div>\n                <p> Ram ram </p>\n                if \n\t\n\t<h4 class="table-heading" style="width: 100%;background-color: #008dc1;color: #ffffff;margin: 0;padding: 15px;text-align: left;text-transform: capitalize;">dgchart</h4>\n\t\t<div class="table-scroll" style="overflow: auto;max-height: 342px;">\n\t\t\t<table style="width: 100%;border-spacing: 0;display: table;border-spacing: 2px;border-color: grey;border-collapse: collapse;">\n\t\t\t\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr style="font-weight:bold;">\n\t\t\t\t\t\n\t\t\t\t\t   <th style="padding: 8px;line-height: 1.5;vertical-align: middle;text-align: left">name</th>\n\t\t\t\t\t\n\t\t\t\t\t   <th style="padding: 8px;line-height: 1.5;vertical-align: middle;text-align: left">experience</th>\n\t\t\t\t\t\n\t\t\t\t\t   <th style="padding: 8px;line-height: 1.5;vertical-align: middle;text-align: left">salary</th>\n\t\t\t\t\t\n\t\t\t\t\t</tr>\n\t\t\t\t\t\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> test1 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 5 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 11 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> test2 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 10 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 4 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> test3 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 6 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 9 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> test4 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 15 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 7 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> test5 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 15 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<td style="padding: 8px;line-height: 1.5;vertical-align: middle;border-top: 1px solid #ddd;"> 10 </td>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\n\t\t\t\t</tbody>\n\t\t\t\n\t\t\t</table>\n\t\t</div>\n\n\t\t\ns\n            <div>\n        </body></html>', u'text/html')]
        self.assertEqual(content, mail.outbox[0].alternatives)

    def test_email_without_subject(self):
        self.report.subject=''
        self.report.save()
        with self.assertRaises(EmailSubjectException):
            send_emails()

    def test_email_without_recipients(self):
        self.recipient.delete()
        self.scheduledReport.delete()
        with self.assertRaises(EmailRecipientException):
            send_emails()

    def tearDown(self):
        Chart.objects.all().delete()
        BaseTestCase.delete_schema(self)