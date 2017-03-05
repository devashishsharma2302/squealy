from django.conf.urls import url
from django.contrib.auth.decorators import login_required

import views

urlpatterns = [
    url(r'^$', login_required(views.squealy_interface)),
    url(r'charts/$', login_required(views.ChartsLoaderView.as_view())),
    url(r'squealy/(?P<chart_url>[-\w]+)/$', login_required(views.ChartView.as_view())),
]
