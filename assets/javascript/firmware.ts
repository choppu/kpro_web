import KProJS from "kprojs";
import TransportWebHID from "kprojs-web-hid";
import { marked } from 'marked';

if (!('process' in window)) {
  // @ts-ignore
  window.process = {}
}

let fwI = 0;

function handleFWLoadProgress(transport: any, loadBar: HTMLProgressElement) : void {
  if (fwI == 0) {
    fwI = 1;
    let pBarProgress = 0;
    transport.on("chunk-loaded", (progress: any) => {
      if (progress >= loadBar.max) {
        transport.off("chunk-loaded");
        i = 0;
      } else {
        pBarProgress += progress
        loadBar.value = pBarProgress;
      }
    })
  }
}

async function handleFirmwareUpdate() : Promise<void> {
  const updateFirmwareBtn = document.getElementById("btn-fw-update") as HTMLButtonElement;
  const progressBar = document.getElementById("fw-progress");
  const fwLoad = document.getElementById("progress-bar") as HTMLProgressElement;
  const mediaPrefixField = document.getElementById("media-prefix") as HTMLInputElement;
  const mediaPrefix = mediaPrefixField.value;
  const fwChangelogLabel = document.getElementById("release-note-fw-version") as HTMLElement;
  const fwChangelogText = document.getElementById("release-note-fw-changelog") as HTMLDivElement;

  const context = await fetch("./context").then((r) => r.json());

  const fw = await fetch(mediaPrefix + context["fw_path"]).then((r) => r.arrayBuffer());
  const changelog = await fetch(mediaPrefix + context["changelog_path"]).then((r) => r.text());

  fwLoad.max = fw.byteLength;

  console.log(JSON.stringify(changelog));

  fwChangelogLabel.innerHTML = "Version " + context["version"];
  fwChangelogText.innerHTML = marked.parse(changelog.replaceAll('\r',''));

  let transport: any;
  let appEth: any;

  updateFirmwareBtn.addEventListener("click", async () => {
    progressBar.classList.remove("kpro_web__display-none");
    try {
      transport = await TransportWebHID.create();
      appEth = new KProJS.Eth(transport);
      handleFWLoadProgress(transport, fwLoad);
      let r = await appEth.loadFirmware(fw);
      console.log(r);
      await transport.close();
      progressBar.classList.add("kpro_web__display-none");
    } catch (e) {
      console.log(e);
      progressBar.classList.add("kpro_web__display-none");
    }
  })
}

handleFirmwareUpdate();