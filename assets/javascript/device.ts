import { QRUtils } from "./qr_utils";
import {UR, UREncoder} from '@ngraveio/bc-ur'
import {Html5QrcodeScanner, Html5Qrcode} from "html5-qrcode";

const QRious = require('qrious');

const devAuthInit = 1;
const devAuthDevice = 2;
const devAuthServer = 3;

const devAuthStep = 1;
const deviceId = 2;
const firstAuth = 3;
const authTime = 4;
const authCount = 5;
const challenge = 6;
const signature = 7;

function onScanSuccess(decodedText: any, decodedResult: any) : void {
  console.log(`Code matched = ${decodedText}`, decodedResult);
}

function onScanFailure(error: any) : void {
  console.warn(`Code scan error = ${error}`);
}

function renderChallengeQR() : void {
  const element = document.getElementById('device_verify__challenge') as HTMLInputElement;
  const dbQR = new QRious({element: document.querySelector('canvas')}) as any;
  const payload = QRUtils.encodeChallenge(element.value);
  const ur = new UR(payload, "dev-auth");
  const maxFragmentLength = 500
  const encoder = new UREncoder(ur, maxFragmentLength);
  setTimeout( () => {
    let html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 400 }, false);
    html5QrcodeScanner.render(onScanSuccess, null);
}, 1000);


  setTimeout(() => {QRUtils.generateQRPart(encoder, dbQR)}, 500);
}

renderChallengeQR();