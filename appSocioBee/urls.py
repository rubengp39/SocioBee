from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
path('', views.index, name='index'),
path('login/', views.login, name='login'),
path('campaigns/', views.campaigns, name='campaigns'),
path('campaignCreation/', views.campaignCreation, name='campaignCreation'),
path('worker/', views.worker, name='worker')
]