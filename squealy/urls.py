from django.conf.urls import url
import views

urlpatterns = [
    url(r'squealy-authoring-interface/', views.squealy_interface),
    url(r'yaml-generator/$', views.YamlGeneratorView.as_view()),
    url(r'test/$', views.SqlApiView.as_view()),
    url(r'database-details/', views.DatabaseView.as_view()),
    url(r'squealy-apis/', views.DynamicApiRouter.as_view()),
    url(r'squealy-dashboard-design/', views.DashboardApiView.as_view()),
    url(r'squealy-dashboard(?:/(?P<api_name>[-\w]+))?/$', views.DashboardTemplateView.as_view())
]
