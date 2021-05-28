from django.urls import path
from . import views

urlpatterns = [
    path("", views.display, name='display'),
    path("register/", views.register, name='register'),
    path("tempRead/", views.tempRead, name='tempRead'),
    path("confirmAcc/", views.confirmAcc, name='confirmAcc'),
    path("registerUserId/", views.registerUserId, name='registerUserId'),
]