import { Nullable } from "../types";
import { primitive } from "./primitive";

function addSearchParam(url: string, key: string, value: string) {
  return url +
    (url.includes('?') ? '&' : '?') +
    `${key}=${encodeURI(value)}`;
}

function addSearchParamList(url: string, ...params: [string, Nullable<string>][]) {
  return params.reduce((ret: string, [key, value]) => {
    if (primitive.isString(value)) {
      ret = addSearchParam(ret, key, value);
    }
    return ret;
  }, url)
}

export const urlHelper = {
  addSearchParam,
  addSearchParamList,
} as const;