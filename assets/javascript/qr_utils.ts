import {URDecoder, UREncoder} from '@ngraveio/bc-ur'

export namespace QRUtils {

  export function toBuffer(arrayBuffer: ArrayBuffer) : Buffer {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }

    return buffer;
  }

  export function displayQRPart(part: any, qrCanv: any, size: number) : void {
    qrCanv.set({
      size: size,
      value: part
    });
  }

  export function generateQRPart(encoder: UREncoder, qrCanv: any, timeout: boolean, size: number) : void {
    let part = encoder.nextPart();
    displayQRPart(part.toUpperCase(), qrCanv, size);

    if(timeout) {
      setTimeout(() => {generateQRPart(encoder, qrCanv, true, size)}, 500);
    }
  }

  export function encodeChallenge(challenge: String) : Buffer {
    return Buffer.from("a20101065820" + challenge, "hex");
  }

  export function decodeQR(decoder: URDecoder, qr: string) : Buffer {
    while (!decoder.isComplete()) {
      decoder.receivePart(qr);
    }

    if (decoder.isSuccess()) {
      const ur = decoder.resultUR();
      return ur.decodeCBOR();
    }
    else {
      const error = decoder.resultError()
      console.log('Error found while decoding', error)
      return;
    }
  }
}