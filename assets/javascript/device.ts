import { QRUtils } from "./qr_utils";
import {UR, UREncoder, URDecoder} from '@ngraveio/bc-ur'
import {Html5Qrcode} from "html5-qrcode";

const QRious = require('qrious');
const postReqURL = './verify';
const verState = {1: "dev_auth_init", 2: "dev_auth_device", 3: "dev_auth_server"};
const keys = {1: "dev_auth_device", 2: "device_id", 3: "first_auth", 4: "auth_time", 5: "auth_count", 6: "challenge", 7: "signature", 8: "initial_challenge"};

async function verify(data: FormData, csrftoken: string, url: string) : Promise<Response|void> {
  try {
    return await fetch(url, {
      method: 'POST',
      headers: {'X-CSRFToken': csrftoken},
      body: data,
      mode: 'same-origin'
    }).then(async (data) => {
      console.log(await data.json());
    });
  } catch(err) {
    console.log(err);
  }
}

async function onScanSuccess(decodedText: any, challenge: string, decoder: URDecoder, csrftoken: string, html5QrCode: Html5Qrcode) : Promise<void> {
  if (html5QrCode.isScanning) {
    await html5QrCode.stop();
    html5QrCode.clear();
  }

  const data = QRUtils.decodeQR(decoder, decodedText);
  const reqData = new FormData();
  const status = data[1];

  if (verState[status as keyof typeof verState] == "dev_auth_device") {
    const deviceId = (data[2] as any).toString("hex");
    const deviceChallenge = (data[6] as any).toString("hex");
    const signature = (data[7] as any).toString("hex");

    reqData.append(keys[2], deviceId);
    reqData.append(keys[6], deviceChallenge);
    reqData.append(keys[7], signature);
    reqData.append(keys[8], challenge);

    verify(reqData, csrftoken, postReqURL);
  } else {
    console.log("QR error");
  }

}

function onScanFailure(error: any) : void {
  return error;
}

async function handleVerifyDevice() : Promise<void> {
  const challenge = document.getElementById('device_verify__challenge') as HTMLInputElement;
  const csrftoken = document.getElementById('device_verify__csfr') as HTMLInputElement;
  const next_btn = document.getElementById("device_verify__next-button");
  const dbQR = new QRious({element: document.querySelector('canvas')}) as any;
  const payload = QRUtils.encodeChallenge(challenge.value);
  const ur = new UR(payload, "dev-auth");
  const maxFragmentLength = 500
  const encoder = new UREncoder(ur, maxFragmentLength);
  const decoder = new URDecoder();
  const html5QrCode = new Html5Qrcode("device_verify__qr-reader");
  const config = {fps: 10, qrbox: 350, aspectRatio: 1};
  QRUtils.generateQRPart(encoder, dbQR, false);

  const cameraId = await Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      return devices[0].id;
    }
  });

  next_btn.addEventListener("click", () => {
    html5QrCode.start(
      cameraId,
      config,
      async (decodedText) => await onScanSuccess(decodedText, challenge.value, decoder, csrftoken.value, html5QrCode),
      (errorMessage) => onScanFailure(errorMessage)
    )
    .catch((err) => {
      console.log(err);
    });
  });
}

handleVerifyDevice();