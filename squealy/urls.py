from django.conf.urls import url
from squealy import views

urlpatterns = [
    url(r'^squealy/$', views.squealy_interface),
    url(r'^yaml-generator/$', views.YamlGeneratorView.as_view()),
    url(r'^test/$', views.SqlApiView.as_view()),
    url(r'^database-details/', views.DatabaseView.as_view())
]
