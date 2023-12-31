import { QRUtils } from "./qr_utils";
import {UR, UREncoder, URDecoder} from '@ngraveio/bc-ur'
import {Html5Qrcode} from "html5-qrcode";



const QRious = require('qrious');
const postReqURL = './verify';
const verState = {
  1: "dev_auth_init",
  2: "dev_auth_device",
  3: "dev_auth_server"
};
const keys = {
  1: "dev_auth_device",
  2: "device_id",
  3: "first_auth",
  4: "auth_time",
  5: "auth_count",
  6: "challenge",
  7: "signature",
  8: "initial_challenge"
};
const maxFragmentLength = 500;

const step1Container = document.getElementById("kpro_web__verify-step1");
const step2Container = document.getElementById("kpro_web__verify-step2");
const step3Container = document.getElementById("kpro_web__verify-step3");
const step4Container = document.getElementById("kpro_web__verify-step4");
const qrMessage = document.getElementById("qr-message") as HTMLSpanElement;
const qrUID = document.getElementById("qr-uid") as HTMLSpanElement;
const qrFirstAuth = document.getElementById("qr-first-auth") as HTMLSpanElement;
const qrLastAuth = document.getElementById("qr-last-auth") as HTMLSpanElement;
const qrCounter = document.getElementById("qr-counter") as HTMLSpanElement;

async function verify(data: FormData, csrftoken: string, url: string) : Promise<any|void> {
  try {
    return await fetch(url, {
      method: 'POST',
      headers: {'X-CSRFToken': csrftoken},
      body: data,
      mode: 'same-origin'
    }).then(async (data) => {
      return await data.json();
    });
  } catch(err) {
    console.log(err);
  }
}

async function stopScanning(html5QrCode:Html5Qrcode) : Promise<void> {
  if (html5QrCode.isScanning) {
    await html5QrCode.stop();
    html5QrCode.clear();
  }
}

function handleDeviceResponse(resp: Buffer, challenge: string) : FormData {
  const reqData = new FormData();
  const deviceId = (resp[2] as any).toString("hex");
  const deviceChallenge = (resp[6] as any).toString("hex");
  const signature = (resp[7] as any).toString("hex");
  console.log(deviceId);

  reqData.append(keys[2], deviceId);
  reqData.append(keys[6], deviceChallenge);
  reqData.append(keys[7], signature);
  reqData.append(keys[8], challenge);

  return reqData;
}

function handleServerResponse(r: any) : void {
  qrMessage.innerHTML = r['message'];

  if(r['status'] == 'success') {
    const firstAuthDate = new Date(r['first_auth']);
    const lastAuthDate = new Date(r['last_auth']);

    qrUID.innerHTML = 'UID: ' + r['uid'];
    qrFirstAuth.innerHTML = 'First Verification: ' + firstAuthDate.toDateString() + ", " + firstAuthDate.getHours() + ":" + firstAuthDate.getMinutes();
    qrLastAuth.innerHTML = 'Last Verification: ' + lastAuthDate.toDateString() + ", " + lastAuthDate.getHours() + ":" + lastAuthDate.getMinutes();
    qrCounter.innerHTML = 'Verification Count: ' + r['counter'];
  }
}

function handleVerificationComplete(r: any) : void {
  step3Container.classList.add('kpro_web__display-none');
  step4Container.classList.remove('kpro_web__display-none');

  if(r['status'] == 'success') {
    const successQR = new QRious({element: document.getElementById('device_success__qr')}) as any;
    const ur = new UR(Buffer.from(r.payload, "hex"), "dev-auth");
    const encoder = {enc: new UREncoder(ur, maxFragmentLength)};

    QRUtils.generateQRPart(encoder, successQR, false, 400);
  }

  handleServerResponse(r);
}

async function onScanSuccess(decodedText: any, challenge: string, decoder: URDecoder, csrftoken: string, html5QrCode: Html5Qrcode) : Promise<void> {
  await stopScanning(html5QrCode);

  const data = QRUtils.decodeQR(decoder, decodedText);
  const status = data[1];

  if (verState[status as keyof typeof verState] == "dev_auth_device") {
    const reqData = handleDeviceResponse(data, challenge);
    const r = await verify(reqData, csrftoken, postReqURL) as any;
    handleVerificationComplete(r);

  } else {
    step3Container.classList.add('kpro_web__display-none');
    step4Container.classList.remove('kpro_web__display-none');
    qrMessage.innerHTML = 'Error: Invalid QR Code. Please make sure you are scanning the QR from your device.';
  }

}

function onScanFailure(error: any) : void {
  return error;
}

async function handleVerifyDevice() : Promise<void> {
  const challenge = document.getElementById('device_verify__challenge') as HTMLInputElement;
  const csrftoken = document.getElementById('device_verify__csfr') as HTMLInputElement;
  const next_btn = document.getElementById("device_verify__next-button");
  const scan_btn = document.getElementById("device_verify__scan-button");
  const verifyQR = new QRious({element: document.getElementById('device_verify__qr')}) as any;
  const payload = QRUtils.encodeChallenge(challenge.value);
  const ur = new UR(payload, "dev-auth");
  const encoder = {enc: new UREncoder(ur, maxFragmentLength)};
  const decoder = new URDecoder();
  const html5QrCode = new Html5Qrcode("device_verify__qr-reader");
  const config = {fps: 10, qrbox: 600, aspectRatio: 1};
  QRUtils.generateQRPart(encoder, verifyQR, false, 400);

  next_btn.addEventListener("click", () => {
    if (step2Container.classList.contains('kpro_web__display-none')) {
      step1Container.classList.add('kpro_web__display-none');
      step2Container.classList.remove('kpro_web__display-none');
    }
  });

  const cameraId = await Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      return devices[0].id;
    }
  });

  scan_btn.addEventListener("click", async () => {
    step2Container.classList.add('kpro_web__display-none');
    step3Container.classList.remove('kpro_web__display-none');
    html5QrCode.start(
      { facingMode: { exact: "environment"} },
      config,
      async (decodedText) => await onScanSuccess(decodedText, challenge.value, decoder, csrftoken.value, html5QrCode),
      (errorMessage) => onScanFailure(errorMessage)
    )
    .catch((err) => {
      html5QrCode.start(
      cameraId,
      config,
      async (decodedText) => await onScanSuccess(decodedText, challenge.value, decoder, csrftoken.value, html5QrCode),
      (errorMessage) => onScanFailure(errorMessage)
    )
    });
  });
}

handleVerifyDevice();