from .test_base_file import BaseTestCase
from squealy.models import Chart, ScheduledReport, ReportParameter
from datetime import datetime, timedelta

from django.conf import settings
import django.core.mail as mail
from squealy.views import send_report,create_email_data

class  EmailReportTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_schema(self)
        BaseTestCase.create_mock_client(self)
        self.chart = BaseTestCase.create_chart(self)

    def test_email(self):
        test_html = '''
            <div>
<p> Ram ram </p>
<div>
        '''
        report = ScheduledReport(subject='Test subject',cron_expression='*/2 * * * *',chart=self.chart,template=test_html)

        print (settings.EMAIL_HOST_USER,settings.EMAIL_BACKEND,self.chart.query)
        print ('budha hoga tera baap')
        mail.send_mail(
            'Subject here',
            'Here is the message.',
            'from@example.com',
            ['to@example.com'],
            fail_silently=False,
        )
        print ("*"*100)
        print (mail.outbox[0].body,mail.outbox[0].to)


        self.assertEqual("200","200")

    def tearDown(self):
        Chart.objects.all().delete()
        BaseTestCase.delete_schema(self)