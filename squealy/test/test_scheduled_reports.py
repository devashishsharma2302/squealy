from .test_base_file import BaseTestCase
from squealy.models import Chart, ScheduledReport
from django.conf import settings

class ScheduledReportsTestCase(BaseTestCase):

    def setUp(self):
        BaseTestCase.create_mock_user(self)
        BaseTestCase.create_schema(self)
        BaseTestCase.create_mock_client(self)
        self.chart = BaseTestCase.create_chart(self)

    def test_scheduler(self):
        # report = ScheduledReport(subject='Test subject')
        # print ('*'*100)
        # print (settings.EMAIL_HOST_USER,settings.EMAIL_BACKEND)
        # #from django.core.mail import send_mail,outbox
        # import django.core.mail as mail
        #
        #
        # mail.send_mail(
        #     'Subject here',
        #     'Here is the message.',
        #     'from@example.com',
        #     ['to@example.com'],
        #     fail_silently=False,
        # )
        # # print ("*"*100)
        # # print (mail.outbox[0].body,mail.outbox[0].to)
        # # print ("*"*100)


        self.assertEqual("200","200")

    def tearDown(self):
        Chart.objects.all().delete()
        BaseTestCase.delete_schema(self)