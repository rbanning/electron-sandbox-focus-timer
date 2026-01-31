export function assertExhaustive(
  value: never, 
  message: string = 'Value was unexpected: should have been handled in earlier check.'
): never {
  console.warn('assertExhaustive()', message, value);
  throw new Error(message);
}
