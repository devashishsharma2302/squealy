from django.conf.urls import url
import views

urlpatterns = [
    url(r'squealy-authoring-interface/', views.squealy_interface),
    url(r'charts/$', views.ChartsLoaderView.as_view()),
    url(r'squealy/(?P<chart_url>[-\w]+)/$', views.ChartView.as_view()),
]
