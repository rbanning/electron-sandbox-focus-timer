import { primitive } from "../general/primitive";

type Callback<T> = (value: T) => void;
export function using<T>(value: T, fn: Callback<T>, context?: unknown) {
  if (primitive.isNotNullish(value)) {
    return fn.apply((context ?? null), [value]);
  }
}


type CallbackWithReturn<T, R> = (value: T) => R;
export function usingWithReturn<T, R>(value: T, fn: CallbackWithReturn<T, R>, context?: unknown): R | undefined {
  if (primitive.isNotNullish(value)) {
    return fn.apply((context ?? null), [value]);
  }
  return undefined;
}