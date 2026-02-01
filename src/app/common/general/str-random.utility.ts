import { arrayHelp } from "./array-help";
import { StrCasing } from "./str.types";


export function randomize(chars: string, length?: number) {
  if (chars) {      
    return arrayHelp.randomize(chars.split(''), length).join('');
  }
  //else
  return '';
}


export function randomString(length: number): string;
export function randomString(length: number, inclDigits: boolean): string;
export function randomString(length: number, inclDigits: boolean, inclUpperCase: boolean): string;
export function randomString(length: number, inclDigits: boolean, mode: StrCasing): string;
export function randomString(length: number, inclDigits: boolean = false, _mode?: unknown | undefined): string {

  const mode: StrCasing = typeof(_mode) === 'boolean'
    ? (_mode === true ? 'mixed' : 'lowercase')
    : (typeof(_mode) === 'string' ? _mode as StrCasing : 'lowercase');

  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWZYZ".split('');    
  const digits = "01234566789".split('');
  const chars = inclDigits ? letters.concat(digits) : letters;
  const ret = [];
  for (let i = 0; i < length; i++) {
    ret.push(chars[Math.floor( Math.random() * chars.length )]);
  }

  const result = ret.join('');
  switch(mode) {
    case 'lowercase': return result.toLocaleLowerCase();
    case 'uppercase': return result.toLocaleUpperCase();
    
    case 'mixed':
    default:
      return result;
  }
}
