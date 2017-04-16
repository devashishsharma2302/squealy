from django.contrib import admin

from blueocean.models import MarketDynamic, MarketKPI, ExecutionKPI, SharePerBrand, SharePerCompany


class MarketDynamicsAdmin(admin.ModelAdmin):
    model = MarketDynamic
    list_display = ('country', 'format', 'year', 'value', 'volume', 'total_value', 'total_volume')


class MarketKPIAdmin(admin.ModelAdmin):
    model = MarketKPI
    list_display = ('country', 'quarter', 'kpi')


class ExecutionKPIAdmin(admin.ModelAdmin):
    model = ExecutionKPI
    list_display = ('country', 'year', 'quarter', 'aware', 'not_aware', 'criteria')


class SharePerBrandAdmin(admin.ModelAdmin):
    model = SharePerBrand
    list_display = ('country', 'brand', 'value2014', 'value2015')


class SharePerCompanyAdmin(admin.ModelAdmin):
    model = SharePerCompany
    list_display = ('country', 'company', 'value2014', 'value2015')

admin.site.register(MarketDynamic, MarketDynamicsAdmin)
admin.site.register(MarketKPI, MarketKPIAdmin)
admin.site.register(ExecutionKPI, ExecutionKPIAdmin)
admin.site.register(SharePerBrand, SharePerBrandAdmin)
admin.site.register(SharePerCompany, SharePerCompanyAdmin)