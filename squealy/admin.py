from django.contrib import admin

from squealy.models import Account, Chart, ChartColumn, ChartParameter, Transformation, Validation


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
    list_display = ['name', 'account', 'url', 'query', 'format', 'type', 'options']


class ChartColumnAdmin(admin.ModelAdmin):
    """
        List display for ChartColumns in Django Admin
    """
    model = ChartColumn
    list_display = ['chart', 'name', 'type']


class ChartParameterAdmin(admin.ModelAdmin):
    """
        List display for ChartParameters in Django Admin
    """
    model = ChartParameter
    list_display = ['chart', 'name', 'data_type', 'mandatory', 'default_value', 'type']


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
    list_display = ['chart', 'query']


admin.site.register(Account, AccountAdmin)
admin.site.register(Chart, ChartAdmin)
admin.site.register(ChartColumn, ChartColumnAdmin)
admin.site.register(ChartParameter, ChartParameterAdmin)
admin.site.register(Transformation, TransformationAdmin)
admin.site.register(Validation, ValidationAdmin)