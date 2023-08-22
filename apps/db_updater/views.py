from django.shortcuts import render
from kpro_web.settings import TEMPLATE_DIR
from .models import DB
from django.views.decorators.http import require_GET
from django.http import HttpResponse


APP_TEMPLATE_DIR = TEMPLATE_DIR + '/kpro_app/'

# Create your views here.

def index(request):
  db = DB.objects.last()
  context = {
    "db_path": db.version + '/db.bin',
    "version": db.version
  }

  return render(request, APP_TEMPLATE_DIR + 'db.html', context)

@require_GET
def security_txt(request):
    lines = [
        "HzV4pDh6R9Y1YE7cQL_I7vGzKj9oVdyeF5qgxWCjDZM.J9bqa4tLDBisdE_rBySdA0b3XcIl0PLE38PWQoPIwiA",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")
