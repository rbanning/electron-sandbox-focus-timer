/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigType } from "dayjs";
import { primitive } from "../primitive";

export function isDayJsConfig(value: unknown): value is ConfigType {
  //string | number | Date | Dayjs | null | undefined
  return primitive.isNullish(value)
        || typeof(value) === 'string'
        || typeof(value) === 'number'
        || value instanceof Date
        || (
          //try to identify the value as an instance of Dayjs
          typeof(value) === 'object'
          && typeof((value as any).isValid) === 'function'
          && typeof((value as any).format) === 'function'
          && typeof((value as any).add) === 'function'
        ); 

}