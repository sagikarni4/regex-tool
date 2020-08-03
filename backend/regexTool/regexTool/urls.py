from django.conf.urls import url
from django.contrib import admin
from regex import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', views.regex_handler),
    url('', views.home),

]
