from django.shortcuts import render
from kpro_web.settings import TEMPLATE_DIR
from .models import Firmware

import secrets
import os

# Create your views here.
APP_TEMPLATE_DIR = TEMPLATE_DIR + '/kpro_app/'
enc_key = os.environ['DEVICE_VERIFICATION_ENC_KEY']

def index(request):
  context = {

  }

  return render(request, APP_TEMPLATE_DIR + 'firmware.html', context)
