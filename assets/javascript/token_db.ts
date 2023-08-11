import {UR, UREncoder} from '@ngraveio/bc-ur'
import { QRUtils } from "./qr_utils";

const QRious = require('qrious');

if (!('process' in window)) {
  // @ts-ignore
  window.process = {}
}

async function generateDBQR() : Promise<void> {
  const element = document.getElementById('db_updater__db-version') as HTMLInputElement;
  const dbQR = new QRious({element: document.querySelector('canvas')}) as any;

  const resp = await fetch(element.value);
  const dbArr = await resp.arrayBuffer();
  const dbBuff = QRUtils.toBuffer(dbArr);

  const ur = new UR(dbBuff, "fs-data");
  const maxFragmentLength = 630;
  const encoder = new UREncoder(ur, maxFragmentLength);

  setTimeout(() => {QRUtils.generateQRPart(encoder, dbQR, true, 450)}, 500);
}

generateDBQR();
