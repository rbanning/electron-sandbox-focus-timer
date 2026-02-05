import { Nullable } from './../types/nullable';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicObject, castAs } from "../types";
import { parsers } from "./parsers";
import { primitive, TypeOfName } from "./primitive";


export const objHelp = {
  isAnyObject,
  deepEqual,
  toPlainObject,
  toTypedObject,
  omitProps,
  keysOf,
  asKeysOf,
  hasKeys,
  hasProps,
} as const;

function toPlainObject(value: unknown): BasicObject {
  try {
    if (primitive.isNullish(value)) {
      return {}; //empty
    }
    else if (primitive.isPrimitive(value)) {
      return {
        value
      }
    }
    //else
    const result = JSON.parse((JSON.stringify(value)));
    return result;
  } 
  catch (error) {
    return {
      error: true,
      message: `Unable to convert to plain object: ${parsers.fromError(error) ?? ''}`
    }
  }
}

function toTypedObject<T extends object = object>(value: unknown): Nullable<T> {
  try {
    if (typeof(value) !== 'object') {
      return undefined;
    }
    //else
    const result = JSON.parse((JSON.stringify(value)));
    return result;
  } 
  catch (error) {
    return null;
  }
}

function omitProps<T extends object = object>(value: T, ...keys: (keyof T)[]) {
  if (!primitive.isObject(value)) {
    throw new Error("omitProps() requires a non-null object argument");
  }
  const obj = keysOf(value).reduce(( ret: any, _key) => {
    const key = castAs<keyof T>(_key);
    if (!keys.includes(key)) {
      ret[key] = value[key];
    }
    return ret;
  }, {});

  return obj;
}

function keysOf<T extends object = object>(obj: T, omit?: (keyof T)[]): (keyof T)[] {
  return castAs<(keyof T)[]>(Object.keys(obj))
    .filter(key => !omit || !omit.includes(key)); //remove any keys in the omit array
}
function asKeysOf<T extends object = object>(obj: T, ...keys: string[]): (keyof T)[] {
  return keysOf<T>(obj)
    .filter(key => keys.includes(String(key)));
}

function isAnyObject(value: unknown): value is object { return typeof(value) === 'object' }

function deepEqual(v1: unknown, v2: unknown, ignore: string[] = ['key']): boolean {
  //simple case ... if either of the two values are primitives, use === 
  if (primitive.isPrimitive(v1) || primitive.isPrimitive(v2)) {
    return v1 === v2;
  }

  //special case for two dates - convert to int and equate
  if (primitive.isDate(v1) && primitive.isDate(v2)) {
    return v1.getTime() === v2.getTime();
  }

  //special case for dayJs - compare via isSame() ... millisecond is default unit of comparison
  // if (primitive.isDayJs(v1) && primitive.isDayJs(v2)) {
  //   return v1.isSame(v2);
  // }

  if (isAnyObject(v1) && isAnyObject(v2)) {
    const keys = {
      v1: keysOf(v1), // Object.keys(v1),
      v2: keysOf(v2), // Object.keys(v2)
    };

    //do the two objects have the same number of keys
    if (keys.v1.length !== keys.v2.length) { return false; }

    //validate that each property of the objects are equal
    for (const key of keys.v1) {
      //check to be sure key is not ignored
      if (!ignore.includes(key)) {
        //both objects must have the key
        if (!keys.v2.includes(key)) { return false; }

        const val1 = v1[key]; 
        const val2 = v2[key]; 

        if (!deepEqual(val1, val2, ignore)) { return false; }
      }

    }
    //done .. all of the props are equal
    return true;
  }

  //else... not sure how to handle the two objects
  console.warn("deepEqual() was unable to evaluate the two values", {v1, v2});
  return false;
}

function hasKeys<T extends BasicObject>(obj: unknown, keys: string[]): obj is T {
  if (!primitive.isObject(obj)) {
    return false;
  }
  
  return keys.every(key => key in obj);
}

export type PropDef = {
  key: string;
  type: TypeOfName;
  nullable?: boolean;
}
function hasProps<T extends BasicObject>(obj: unknown, props: PropDef[]): obj is T {
  if (!primitive.isObject(obj)) {
    return false;
  }

  return props.every(({key, type, nullable}) => 
    (nullable === true || primitive.isNotNullish(obj[key]))
    || (key in obj && 
        typeof(obj[key]) === type)
  );
}

