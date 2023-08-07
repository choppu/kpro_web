from django.shortcuts import render
from django.http import HttpResponse
from kpro_web.settings import TEMPLATE_DIR
from secp256k1Crypto import PublicKey, PrivateKey
from .models import Device

import secrets
import json
import hashlib
import datetime
import time
import os

# Create your views here.
APP_TEMPLATE_DIR = TEMPLATE_DIR + '/kpro_app/'
enc_key = os.environ['DB_ENCRYPTION_KEY']
c = "f55a3898e7ff89aa4320533be775d6f4ac7eb15a8b8e3639fcab051fce6a313f"

def index(request):
  context = {
    "challenge": secrets.token_hex(32)
  }

  return render(request, APP_TEMPLATE_DIR + 'device_verify.html', context)

def verify(request):
  if request.method == 'POST':
    device_id = request.POST.get('device_id')
    challenge = request.POST.get('challenge')
    signature = request.POST.get('signature')
    initial_challenge = request.POST.get('initial_challenge')
    device = None
    message = None
    m = hashlib.sha256()


    try:
      device = Device.objects.get(uid=device_id)
    except:
      resp = {'error': 'No device ' + device_id + ' found'}

    public_key = PublicKey(bytes(bytearray.fromhex(device.public_key)), raw=True)

    m.update(bytes(bytearray.fromhex(device_id)))
    m.update(bytes(bytearray.fromhex(initial_challenge)))
    h = m.digest()
    sig = public_key.ecdsa_deserialize_compact(bytes(bytearray.fromhex(signature)))

    if public_key.ecdsa_verify(h, sig, raw=True):
      m = hashlib.sha256()
      if (device.verification_start_date == None):
        device.verification_start_date = datetime.datetime.utcnow()

      device.success_counter = device.success_counter + 1
      device.save()

      verification_date = time.mktime(datetime.datetime.utcnow().timetuple())
      first_verification = time.mktime(device.verification_start_date.timetuple())

      vd_32 = int(verification_date).to_bytes(4, 'little')
      fv_32 = int(first_verification).to_bytes(4, 'little')
      counter = device.success_counter.to_bytes(4, 'little')

      m.update(bytes(bytearray.fromhex(device.uid)))
      m.update(bytes(bytearray.fromhex(challenge)))
      m.update(fv_32)
      m.update(vd_32)
      m.update(counter)
      m_hash = m.digest();

      key = PrivateKey(bytes(bytearray.fromhex(enc_key)), raw=True)
      sig = key.ecdsa_sign(m_hash, raw=True)
      m_signature = key.ecdsa_serialize_compact(sig)

      resp = {'success': 'Device successfully verified', 'first_auth': first_verification, 'last_auth': verification_date, 'counter': device.success_counter, 'signature': m_signature.hex()}
    else:
      resp = {'error': 'Invalid signature'}

    return HttpResponse(json.dumps(resp), content_type='application/json')
