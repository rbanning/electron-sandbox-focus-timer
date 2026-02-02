import { castAs, Nullable } from "../types";
import { primitive } from "./primitive";

export const arrayHelp = {
  randomize, 
  random,
  unique,
  take,
  first, last,
  inBounds,
  fill,
  extract,
  removeNullable,
  elementsOfType
} as const;


function randomize<T>(arr: T[], count?: number): T[] {
  if (Array.isArray(arr)) {
    const clone = arr.slice();

    let length = clone.length;
    let index = 0;
    while (length > 0) {
      index = Math.floor(Math.random() * length);
      length--;

      //swap
      [ clone[length], clone[index] ] = [ clone[index], clone[length] ];
    }

    //how many items should we return?
    count = Math.max(typeof(count) === 'number' ? count : clone.length, 1);  //must be 1 or greater
    count = Math.min(count, clone.length);  //cannot be greater than array's length
    
    if (count >= clone.length) {
      return clone;
    } else {
      return clone.slice(0, count);
    }
  }
  //else
  return [];
}

function random<T>(arr: T[]): T {
  if (Array.isArray(arr)) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  //else
  throw new Error('arrayHelp.random() expects an array parameter');
}

function unique<T>(arr: T[]): T[] {
  if (Array.isArray(arr)) {
    //only include if it is the first occurrence of the value
    return arr.filter((v: T, index: number) => arr.indexOf(v) === index);  
  }

  //else
  return [];
}

function take<T>(arr?: T[], count?: number, from: 'start' | 'end' = 'start'): T[] {
  arr = Array.isArray(arr) ? arr : [];
  count = typeof(count) === 'number' ? Math.min(count, arr.length) : arr.length;

  if (from === 'start') {
    return arr.slice(0, count);
  } else {
    return arr.slice(Math.max(0, arr.length - count));
  }
}

/*
  10 .. 4 .. (10 - 4) => 6,7,8,9
   5 .. 4 .. ( 5 - 4) => 1,2,3,4
   4 .. 4 .. ( 4 - 4) => 0,1,2,3

*/

function first<T>(arr?: T[]): T | undefined {
  if (arr && arr.length > 0) {
    return arr[0];
  }
  //else
  return undefined;
}

function last<T>(arr?: T[]): T | undefined {
  if (arr && arr.length > 0) {
    return arr[arr?.length - 1];
  }
  //else
  return undefined;
}

function inBounds(arr: Nullable<unknown[]>, index: number) {
  return (Array.isArray(arr)) 
    && index < arr.length
    && index >= 0;
}

function fill<T>(size: number, value: T): T[] {
  return new Array(size).fill(value);
}

function extract<T>(
  source: T[], 
  filterFn: (item: T) => boolean,
  orderFn?: (a: T, b: T) => number,
  count?: number
) {

  const result =  source.filter(filterFn);
  if (typeof(orderFn) === 'function') {
    result.sort(orderFn); //mutable
  }
    
  return arrayHelp.take(result, count);
}

function removeNullable<T>(array: Nullable<T>[]): T[] {
  if (!Array.isArray(array)) {
    throw new Error("removeNullable() expects an array argument");
  }
  //else
  return castAs<T[]>(array.filter(m => !primitive.isNullish(m)));
}


function elementsOfType<T>(value: unknown, tester: (x: unknown) => x is T): value is T[] {
  if (Array.isArray(value)) {
    return value.every(x => tester(x));
  }
  //else
  return false;
}