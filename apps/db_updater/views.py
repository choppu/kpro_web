from django.shortcuts import render
from kpro_web.settings import TEMPLATE_DIR
from .models import DB


APP_TEMPLATE_DIR = TEMPLATE_DIR + '/kpro_app/'

# Create your views here.

def index(request):
  db = DB.objects.last()
  context = {
    "db_path": db.version + '/db.bin'
  }

  return render(request, APP_TEMPLATE_DIR + 'index.html', context)
