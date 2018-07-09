from __future__ import absolute_import

from django.contrib import admin
from django.template.defaultfilters import escape
from django.core.urlresolvers import reverse

from djcelery.models import (TaskState, WorkerState,
                 PeriodicTask, IntervalSchedule, CrontabSchedule)

from social_django.models import UserSocialAuth, Nonce, Association
from social_django.admin import UserSocialAuthOption, NonceOption, AssociationOption

from squealy.models import Account, Chart, Parameter,\
    Transformation, Validation, ScheduledReport, ReportParameter,\
    ReportRecipient, ScheduledReportChart, Filter, FilterParameter
from .forms import ScheduledReportForm


class ReportRecipientAdmin(admin.TabularInline):
    model = ReportRecipient


class ScheduledReportParamAdmin(admin.TabularInline):
    model = ReportParameter


class ScheduledReportAdmin(admin.ModelAdmin):
    """
        List display for Scheduled reports in Django admin
    """
    model = ScheduledReport
    list_display = ('id', 'get_recipients', 'get_parameters')
    inlines = [
        ScheduledReportParamAdmin,
        ReportRecipientAdmin
    ]
    form = ScheduledReportForm

    def get_parameters(self, model):
        param_list = '<ul>'
        for param in model.reportparam.all().values_list('parameter_name', 'parameter_value'):
            param_list = param_list + '<li>' + param[0] + ': ' + param[1] + '</li>'
        param_list = param_list + '</ul>'
        return param_list

    def get_recipients(self, model):
        recipients = model.reportrecep.all().values_list('email', flat=True)
        if not recipients:
            return 'No recipients added'
        recipient_list = ''
        for recipient in recipients:
            recipient_list = recipient_list + recipient + ', '
        return recipient_list[:-2]

    get_recipients.short_description = 'Recipients'
    get_parameters.short_description = 'Parameters and value'
    get_parameters.allow_tags = True
    get_recipients.allow_tags = True


class AccountAdmin(admin.ModelAdmin):
    """
        List display for Accounts in Django Admin
    """
    model = Account
    list_display = ['name']


class ChartAdmin(admin.ModelAdmin):
    """
        List display for Charts in Django Admin
    """
    model = Chart
    list_display = ['name', 'account', 'url', 'format', 'type', 'transpose', 'options']


class FilterAdmin(admin.ModelAdmin):
    """
        List display for Filters in Django Admin
    """
    model = Filter
    list_display = ['name', 'url', 'query', 'database']


class FilterParameterAdmin(admin.ModelAdmin):
    """
        List display for Filter Parameter in Django Admin
    """
    model = Filter
    list_display = ['filter', 'name', 'default_value']



class ParameterAdmin(admin.ModelAdmin):
    """
        List display for ChartParameters in Django Admin
    """
    model = Parameter
    list_display = ['chart', 'name', 'data_type', 'mandatory', 'default_value', 'test_value', 'type', 'kwargs']


class TransformationAdmin(admin.ModelAdmin):
    """
        List display for Transformations in Django Admin
    """
    model = Transformation
    list_display = ['chart', 'name', 'kwargs']


class ValidationAdmin(admin.ModelAdmin):
    """
        List display for Validations in Django Admin
    """
    model = Validation
    list_display = ['chart', 'name', 'query']



class ScheduledReportChartAdmin(admin.ModelAdmin):
    """
        List display for ScheduledReportChart Admin
    """
    model = ScheduledReportChart
    list_display = ('get_report_name','get_chart_name')

    def get_report_name(self, model):
        return model.report.subject

    def get_chart_name(self, model):
        return '<a href="/admin/squealy/chart/' + str(model.chart.id) + '/change/">' + str(model.chart.name) + '</a>'


    get_report_name.short_description = "Report Name"
    get_chart_name.short_description = "Chart Name"
    show_change_link = True
    get_chart_name.allow_tags = True


admin.site.register(Account, AccountAdmin)
admin.site.register(Chart, ChartAdmin)
admin.site.register(Parameter, ParameterAdmin)
admin.site.register(Transformation, TransformationAdmin)
admin.site.register(Validation, ValidationAdmin)
admin.site.register(ScheduledReport, ScheduledReportAdmin)
admin.site.register(ScheduledReportChart, ScheduledReportChartAdmin)
admin.site.register(Filter, FilterAdmin)
admin.site.register(FilterParameter, FilterParameterAdmin)

admin.site.unregister(TaskState)
admin.site.unregister(WorkerState)
admin.site.unregister(IntervalSchedule)
admin.site.unregister(CrontabSchedule)
admin.site.unregister(PeriodicTask)


admin.site.unregister(UserSocialAuth)
admin.site.unregister(Nonce)
admin.site.unregister(Association)



