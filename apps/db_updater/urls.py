from django.urls import path
from . import views

app_name = "db"
urlpatterns = [
  path("", views.index, name="db-index"),
]