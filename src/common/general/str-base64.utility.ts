/// <reference types="node" />

export const base64 = {
  encode,
  decode,
} as const;

function encode(text: string): string {
  if (typeof(window) !== 'undefined' && 'btoa' in window) {
    return window.btoa(text);
  } else if (typeof(Buffer) !== 'undefined') {
    return Buffer.from(text || '').toString('base64');
  }
  //else
  throw new Error('Unable to convert text to base64');
}

function decode(code: string): string {
  if (typeof(window) !== 'undefined' && 'atob' in window) {
    return window.atob(code);
  } else if (typeof(Buffer) !== 'undefined') {
    return Buffer.from(code, 'base64').toString('utf-8');
  }
  //else
  throw new Error('Unable to convert code from base64');
}
