from django.shortcuts import render
from kpro_web.settings import TEMPLATE_DIR

from .models import Device
import secrets

# Create your views here.
APP_TEMPLATE_DIR = TEMPLATE_DIR + '/kpro_app/'

def verify_device(request):
  context = {
    "challenge": secrets.token_hex(32)
  }

  return render(request, APP_TEMPLATE_DIR + 'device_verify.html', context)
