from django.contrib import admin

from blueocean.models import MarketDynamic, MarketKPI, ExecutionKPI


class MarketDynamicsAdmin(admin.ModelAdmin):
    """
        List display for ScheduledReportChart Admin
    """
    model = MarketDynamic
    list_display = ('country', 'format', 'year', 'value', 'volume', 'total_value', 'total_volume')


class MarketKPIAdmin(admin.ModelAdmin):
    model = MarketKPI
    list_display = ('country', 'quarter', 'kpi')

class ExecutionKPIAdmin(admin.ModelAdmin):
    model = ExecutionKPI
    list_display = ('country', 'year', 'quarter', 'aware', 'not_aware', 'criteria')


admin.site.register(MarketDynamic, MarketDynamicsAdmin)
admin.site.register(MarketKPI, MarketKPIAdmin)
admin.site.register(ExecutionKPI, ExecutionKPIAdmin)