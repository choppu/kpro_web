import json
from django.http import HttpResponse
from django.shortcuts import render
from kpro_web.settings import TEMPLATE_DIR
from .models import Firmware

# Create your views here.
APP_TEMPLATE_DIR = TEMPLATE_DIR + '/kpro_app/'

def index(request):
  return render(request, APP_TEMPLATE_DIR + 'firmware.html', context=None)

def fw_context(request):
  fw = Firmware.objects.last()

  fw_context = {
    "fw_path": fw.version + '/firmware.bin',
    "changelog_path": fw.version + '/changelog.md',
    "version": fw.version
    }

  return HttpResponse(json.dumps(fw_context), content_type='application/json')
