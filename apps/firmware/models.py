from django.db import models

# Create your models here.

class Firmware(models.Model):
  version = models.CharField(max_length=10, unique=True, default="00.00.01")

  def __str__(self):
        return f"{self.version}"
