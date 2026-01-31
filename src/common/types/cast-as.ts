// IMPORTANT: castAs() should only be used as a last resort.
// It is a workaround for TypeScript's type system and should be avoided if possible.

export function castAs<T>(value: unknown): T {
  return value as T;
}