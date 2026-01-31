import { Nullable } from "./nullable";

export type Primitive = Nullable<
  | string
  | number
  | boolean
  | symbol
  | bigint
>;