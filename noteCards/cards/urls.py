from django.conf.urls import patterns, include, url
from api import CardItemDetail, CardItemList, CardItemUpdate

from django.contrib.auth import views as auth_views

urlpatterns = patterns('',
    url(r'^/(?P<pk>\d+)$', CardItemDetail.as_view(), name='card-detail'),
    url(r'^/update/(?P<title>.+)$', CardItemUpdate.as_view(), name='card-update'),
    url(r'^/$', CardItemList.as_view(), name='card-list'),
)
