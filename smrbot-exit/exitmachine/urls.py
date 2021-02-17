from django.urls import path
from . import views

urlpatterns = [
    path('',views.display , name="home"),
    path('register/',views.register , name="registration")

]