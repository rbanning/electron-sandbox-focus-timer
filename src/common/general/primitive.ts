import dayjs from 'dayjs';
import { BasicObject, Nullish, Primitive } from '../types';

export function isNullish(value: unknown): value is Nullish {
  return (value === null || value === undefined || typeof(value) === 'undefined');
}

export function isOfType<T>(value: unknown): value is T {
  return !isNullish(value);
}

function isArray<T = unknown>(value: unknown): value is Array<T> { return Array.isArray(value); }
function isDate(value: unknown): value is Date { return value instanceof Date; }

interface DayJsIsh { isValid: () => boolean, format: () => string}
function isDayJs(value: unknown): value is dayjs.Dayjs { 
  return !!value &&
     typeof((value as DayJsIsh).isValid) === 'function' && (value as DayJsIsh).isValid() === true
     && typeof((value as DayJsIsh).format) === 'function' && typeof((value as DayJsIsh).format()) === 'string';
}

function isObject(value: unknown): value is BasicObject {
  return typeof(value) === 'object'
    && value !== null
    && !isArray(value)
    && !isDate(value)
    && !isDayJs(value);
}

function isPrimitive(value: unknown): value is Primitive {
  return isNullish(value)
    || typeof(value) !== 'object';
}

function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return !isNullish(value) && typeof(value) === 'function';
}

function isEmpty(value: unknown) {
  if (isNullish(value)) { return true; }
  //else ... check type
  if (isArray(value)) { return value.length === 0; }                //no elements in array
  if (isObject(value)) { return Object.keys(value).length === 0; }  //no properties on object
  if (typeof(value) === 'string') { return value.length === 0; }    //string with length zero
  if (typeof(value) === 'number') { return isNaN(value); }          //not a valid number

  //else
  return true;
}

export type TypeOfName = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'object' | 'function' | 'undefined';


export const primitive = {
  isNotNullish: <T>(obj: unknown): obj is T => !isNullish(obj),
  isNullish: (obj: unknown): obj is Nullish => isNullish(obj),
  isOfType,
  isPrimitive,

  isNumber: (obj: unknown): obj is number => Number.isFinite(obj),
  isInteger: (obj: unknown): obj is number => Number.isInteger(obj),

  isBoolean: (obj: unknown): obj is boolean => typeof(obj) === 'boolean',
  isString: (obj: unknown): obj is string => typeof(obj) === 'string',

  isObject,
  isArray,
  isDate,
  isDayJs,
  isFunction,

  isEmpty,
}
