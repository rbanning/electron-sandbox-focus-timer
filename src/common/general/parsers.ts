import dayjs from 'dayjs';
import { Nullable } from '../types/nullable';
import { strHelp } from './str-help';
import { primitive } from './primitive';
import { dayjsHelp } from './dayjs-help/dayjs-help';
import { parseGeneralError, parseHttpError } from './http-errors.helper';

export const parsers = {
  toBoolean,
  toBooleanAlt,
  toBooleanStrict,

  toNumber,
  toInt,
  toFloat: toNumber,
  
  toString,
  toStringStrict,
  toBase64,
  fromBase64,
  
  toDayjs,
  toDayjsUtc,
  toDate: toDayjs,

  toError,
  fromError: parseGeneralError,
  fromHttpError: async (resp: Response, additionalFieldKeys?: Nullable<string[]>) => await parseHttpError(resp, additionalFieldKeys),

  tryParseJSON,

  stringToEnum,
  toStringUnionType,

  fromSlug,
};

function toBoolean(
  obj: unknown,
  defaultValue: Nullable<boolean> = null
): Nullable<boolean> {
  let bool = defaultValue;

  if (primitive.isBoolean(obj)) {
    bool = obj as boolean;
  } else if (primitive.isNumber(obj)) {
    bool = (obj as number) !== 0;
  } else if (primitive.isString(obj)) {
    bool = strHelp.equals('true', obj as string, true);
  }

  return bool;
}

function toBooleanAlt(
  obj: unknown,
  trueStrings: string[] = ['true', 'yes', 'on'],
  defaultValue: Nullable<boolean> = null
): Nullable<boolean> {
  let bool = defaultValue;
  trueStrings = trueStrings || [];
  if (primitive.isBoolean(obj)) {
    bool = obj as boolean;
  } else if (primitive.isNumber(obj)) {
    bool = (obj as number) !== 0;
  } else if (primitive.isString(obj)) {
    bool = trueStrings.some((m) =>
      strHelp.equals(m, obj as string, true)
    );
  }

  return bool;
}

function toBooleanStrict(obj: unknown, defaultValue: boolean = false): boolean {
  let bool = defaultValue;

  if (primitive.isBoolean(obj)) {
    bool = obj as boolean;
  } else if (primitive.isNumber(obj)) {
    bool = (obj as number) !== 0;
  } else if (primitive.isString(obj)) {
    bool = strHelp.equals('true', obj as string, true);
  }

  return bool;
}

function toNumber(
  obj: unknown,
  defaultValue: Nullable<number> = null
): Nullable<number> {
  let num = defaultValue;
  if (primitive.isNumber(obj)) {
    num = obj as number;
  } else if (primitive.isString(obj)) {
    num = Number.parseFloat(obj as string);
    num = Number.isNaN(num) ? defaultValue : num;
  } else if (primitive.isBoolean(obj)) {
    num = (obj as boolean) ? 1 : 0;
  }

  return num;
}

function toInt(
  obj: unknown,
  defaultValue: Nullable<number> = null
): Nullable<number> {
  let num = defaultValue;
  if (primitive.isNumber(obj)) {
    num = Math.floor(obj as number); //chop off any decimal
  } else if (primitive.isString(obj)) {
    num = Number.parseInt(obj as string);
    num = Number.isNaN(num) ? defaultValue : num;
  } else if (primitive.isBoolean(obj)) {
    num = (obj as boolean) ? 1 : 0;
  }

  return num;
}

function toString(
  obj: unknown,
  defaultValue: Nullable<string> = null
): Nullable<string> {
  if (primitive.isNotNullish(obj)) {
    return String(obj); // `${obj}`;
  }

  //else
  return defaultValue;
}

function toStringStrict(
  obj: unknown,
  defaultValue: Nullable<string> = null
): Nullable<string> {
  if (primitive.isString(obj)) {
    return obj as string;
  }
  //else
  return defaultValue;
}

//base64
function toBase64(text: unknown): Nullable<string> {
  text = toString(text);
  if (primitive.isString(text)) {
    return strHelp.toBase64(text as string);
  }
  //else
  return null;
}

function fromBase64(text: unknown): Nullable<string> {
  text = toString(text);
  if (primitive.isString(text)) {
    return strHelp.fromBase64(text as string);
  }
  //else
  return null;
}

//Dates (as DayJs) are included as 'primitives' as we treat them as base-level objects
function toDayjs(
  value: dayjs.ConfigType,
  defaultValue: Nullable<dayjs.Dayjs> = null
): Nullable<dayjs.Dayjs> {
  return dayjsHelp.toDayJs(value, defaultValue);
}

function toDayjsUtc(
  value: dayjs.ConfigType,
  defaultValue: Nullable<dayjs.Dayjs> = null
): Nullable<dayjs.Dayjs> {
  return dayjsHelp.toDayJsUtc(value, defaultValue);
}


function tryParseJSON(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return json;
  }
}

function stringToEnum<T>(enumObj: T, str: string): Nullable<T[keyof T]> {
  try {
    return enumObj[str as keyof T];
  } catch {
    return null;
  }
}

function toStringUnionType<T extends string>(value: unknown, possible: Readonly<T[]>): Nullable<T> {
  return strHelp.isStringUnionType<T>(value, possible) ? value : null;
}

function fromSlug(value: unknown, quiet?: boolean): Nullable<string> {
  if (value) {
    if (typeof(value) === 'string') { return value; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ('current' in (value as any)) { return fromSlug((value as any).current); }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ('slug' in (value as any)) { return fromSlug((value as any).slug); }
  }
  if (!quiet) {
    console.warn("Invalid slug found", {type: typeof(value), value});
  }
  return null;
}

function toError(arg: unknown, cause?: unknown): Error {
  if (primitive.isNullish(arg)) {
    return new Error('Unknown Error', { cause: cause ?? 'No further information available' });
  }
  else if (arg instanceof Error) {
    return arg;
  }
  else if (typeof(arg) === 'string') {
    return new Error(arg, { cause });
  }
  else if (primitive.isObject(arg)) {    
    return new Error(parseGeneralError(arg) ?? 'Unknown Error', { cause: cause ?? arg['cause'] ?? 'Unknown cause'});
  }
  //else
  return new Error('Unknown Error', { cause: cause ?? 'Could not determine error' });

}