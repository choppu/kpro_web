import json
from django.shortcuts import render
from kpro_web.settings import TEMPLATE_DIR
from .models import DB
from django.views.decorators.http import require_GET
from django.http import HttpResponse


APP_TEMPLATE_DIR = TEMPLATE_DIR + '/kpro_app/'

# Create your views here.

def index(request):
  return render(request, APP_TEMPLATE_DIR + 'db.html')

def db_context(request):
  db = DB.objects.last()

  context = {
    "db_path": db.version + '/db.bin',
    "version": db.version
  }

  return HttpResponse(json.dumps(context), content_type='application/json')

@require_GET
def security_txt(request):
    lines = [
        "HzV4pDh6R9Y1YE7cQL_I7vGzKj9oVdyeF5qgxWCjDZM.J9bqa4tLDBisdE_rBySdA0b3XcIl0PLE38PWQoPIwiA",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")
