/* eslint-disable @typescript-eslint/no-explicit-any */

import { Nullable } from "../types";
import { HttpResponseError } from "./http-response-error";

export function parseGeneralError(error: unknown, subParse?: boolean): Nullable<string> {
  if (error) {
    //if the error is a string, we are all set.
    if (typeof(error) === 'string') { return error; }

    //if the error is an array parse each of its elements (recursively) and join
    if (Array.isArray(error)) {
      return error.map(x => parseGeneralError(x, true))
        .filter(Boolean)
        .join(": ") || null;
    }

    //if the error is an object, parse each of its properties (recursively) and join
    if (typeof(error) === 'object') {
      if (!subParse) {
        //first check to see if error object has "known" error properties
        //  if any are found, parse them.
        const ret = ['message', 'reason', 'error', 'errors', 'code'].map(key => {
          return (key in (error as any)) ? parseGeneralError((error as any)[key], true) : null;
        }).filter(Boolean);
  
        //if any "known" properties resulted in a parsed error, return them
        if (ret.length > 0) { return ret.join('; '); }
      }

      //otherwise... parse each of the properties of the object
      return Object.keys(error)
        .reduce((ret, key) => {
          ret.push(parseGeneralError((error as any)[key]));
          return ret;
        }, [] as Nullable<string>[])
        .filter(Boolean)
        .join('; ') || null;
    }
  }
  //else
  return null;
}

export async function parseHttpError(resp: Response, errorKeys?: Nullable<string[]>): Promise<HttpResponseError> {
  if (resp instanceof Response) {
    return HttpResponseError.parseResponse(resp, errorKeys);
  }

  //else
  console.warn("parseHttpError failed: invalid Response", {resp});
  throw new Error("parseHttpError failed: invalid Response");
}

// --- HELPERS ---

type ContentType = 'json' | 'text' | 'other';
function getContentType(resp: Response): ContentType | undefined {
  const header = resp.headers.get('Content-Type');
  if (header) {
    const value = header.split(';')[0]; //ignore charset if included
    if (value.includes('json')) { return 'json'; }
    if (value.includes('text')) { return 'text'; }
    //else
    return 'other';
  }
  //else
  return undefined;
}