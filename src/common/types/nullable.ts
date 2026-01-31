import { OptionalOfType } from "./optional-of-type";

export type Nullable<T> = OptionalOfType<T>; //alias
export type Nullish = null | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;