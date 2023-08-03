from django.db import models
import datetime

version_str = datetime.datetime.now()

# Create your models here.

class Device(models.Model):
  uid = models.CharField(max_length=32, unique=True)
  public_key = models.CharField(max_length=65, unique=True)
  verification_start_date = models.DateTimeField(null=True, blank=True, default=None)
  success_counter = models.IntegerField(default=0)

  def __str__(self):
        return f"{self.uid}, {self.public_key}, {self.verification_start_date}, {self.success_counter}"

