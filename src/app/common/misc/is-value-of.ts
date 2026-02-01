import { primitive } from "../general";

type ComparerFn = (a: unknown, b: unknown) => boolean;  //a "equals" b

export function isValueOf<T extends object>(value: unknown, obj: T, comparer: ComparerFn): boolean;
export function isValueOf<T extends object>(value: unknown, obj: T, ): boolean;
export function isValueOf<T extends object>(value: unknown, obj: T, comparer?: ComparerFn): boolean {
  if (primitive.isNullish(obj)) {
    return false;
  }
  comparer ??= (a,b) => a === b;

  return Object.values(obj).findIndex(m => comparer(m, value)) >= 0;
}