import {UREncoder} from '@ngraveio/bc-ur'

export namespace QRUtils {

  export function toBuffer(arrayBuffer: ArrayBuffer) : Buffer {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }

    return buffer;
  }

  export function displayQRPart(part: any, qrCanv: any) : void {
    qrCanv.set({
      size: 450,
      value: part,
      padding: 15
    });
  }

  export function generateQRPart(encoder: UREncoder, qrCanv: any) : void {
    let part = encoder.nextPart();
    console.log(part);

    displayQRPart(part.toUpperCase(), qrCanv);
    setTimeout(() => {generateQRPart(encoder, qrCanv)}, 500);
  }

  export function encodeChallenge(challenge: String) : Buffer {
    return Buffer.from("a20101065820" + challenge, "hex");
  }
}