export function exhaustiveCheck(
  value: never, 
  message: string = "Value was unexpected: should have been handled in earlier checks"
): never {
  console.warn('exhaustiveCheck()', message, value);  
  return value;
}