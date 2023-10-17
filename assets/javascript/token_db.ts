import {UR, UREncoder} from '@ngraveio/bc-ur'
import { QRUtils } from "./qr_utils";
import KProJS from "kprojs";
import TransportWebHID from "kprojs-web-hid";
import Transport, { StatusCodes } from 'kprojs/lib/transport';
import Eth from 'kprojs/lib/eth';
import { UIUtils } from './ui_utils';

const QRious = require('qrious');

if (!('process' in window)) {
  // @ts-ignore
  window.process = {}
}

async function generateDBQR() : Promise<void> {
  const mediaPrefix = document.getElementById('db_updater__media-prefix') as HTMLInputElement;
  const dbVersionLabel = document.getElementById("db-version-label") as HTMLSpanElement;
  const dbUSBUpdateBtn = document.getElementById("btn-db-usb-update") as HTMLButtonElement;
  const progressBar = document.getElementById("db-progress");
  const logMessage = document.getElementById("kpro-db-web-msg") as HTMLSpanElement;
  const dbLoad = document.getElementById("db-progress-bar") as HTMLProgressElement;
  const dbQR = new QRious({element: document.querySelector('canvas')}) as any;

  const context = await fetch("./context").then((r: any) => r.json());
  const resp = await fetch(mediaPrefix.value + context["db_path"]);
  const dbArr = await resp.arrayBuffer();
  const dbBuff = QRUtils.toBuffer(dbArr);

  const ur = new UR(dbBuff, "fs-data");
  const maxFragmentLength = 800;
  const encoder = new UREncoder(ur, maxFragmentLength);

  dbVersionLabel.innerHTML = "DB version " + context["version"];

  let transport: Transport;
  let appEth: Eth;

  dbLoad.max = dbArr.byteLength;

  setTimeout(() => {QRUtils.generateQRPart(encoder, dbQR, true, 450)}, 500);

  dbUSBUpdateBtn.addEventListener("click", async () => {
    try {
      transport = await TransportWebHID.create();
      appEth = new KProJS.Eth(transport);
      let { erc20Version } = await appEth.getAppConfiguration();

      if (erc20Version == context["version"]) {
        UIUtils.handleMessageLog(logMessage, "You already have the latest ERC20 database version");
      } else {
        progressBar.classList.remove("kpro_web__display-none");
        UIUtils.handleFWLoadProgress(transport, dbLoad);

        await appEth.loadERC20DB(dbArr);
        await transport.close();

        progressBar.classList.add("kpro_web__display-none");
        UIUtils.handleMessageLog(logMessage, "ERC20 database updated successfully");
      }
    } catch (e) {
      if (e instanceof KProJS.KProError.TransportOpenUserCancelled) {
        UIUtils.handleMessageLog(logMessage, "Error connecting to device. Check if Keycard Pro is connected");
      } else {
       let m = (e.statusCode == StatusCodes.SECURITY_STATUS_NOT_SATISFIED) ? "ERC20 database update canceled by user" :  "Error: Failed to update the ERC20 database";
       UIUtils.handleMessageLog(logMessage, m)
      }
      progressBar.classList.add("kpro_web__display-none");
    }
  });
}

generateDBQR();
