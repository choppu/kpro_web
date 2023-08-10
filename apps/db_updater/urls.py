from django.urls import path
from . import views

app_name = "db"
urlpatterns = [
  path("", views.index, name="db-index"),
  path(".well-known/acme-challenge/HzV4pDh6R9Y1YE7cQL_I7vGzKj9oVdyeF5qgxWCjDZM", views.security_txt)
]