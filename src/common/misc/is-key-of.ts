// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isKeyOf<T extends object>(key: keyof any, obj: T): key is keyof T {
  return Object.prototype.hasOwnProperty.apply(obj, [key]);
}