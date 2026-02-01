import { primitive } from "../general";
import { Nullable } from "../types";

export function assertNotNullish<T>(value: Nullable<T>, errorMessage?: string): T {
  if (primitive.isNullish(value)) {
    throw new Error(errorMessage ?? "Value is null or undefined");
  }
  return value;
}
