import { parsers } from "./parsers";
import { primitive } from "./primitive";

export const numberHelp = {
  randomInt,
  formatWithCommas,
  formatAsCurrency,
  greatestCommonDivisor,
} as const;

function randomInt(min: number = 0, max: number = 100) {
  //ensure min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatWithCommas(value: unknown, decimals: number, defaultResult = 'n/a'): string {
  const amt = parsers.toNumber(value);
  if (primitive.isNumber(amt)) {
    const parts = amt.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");  //https://stackoverflow.com/a/2901298
    return parts.join('.');
  }

  //else
  return defaultResult;
}


function formatAsCurrency(value: unknown, decimals: 0 | 2, defaultResult = 'n/a'): string  {
  const amt = parsers.toNumber(value);
  if (primitive.isNumber(amt)) {
    return `$${formatWithCommas(amt, decimals, defaultResult)}`;
  }

  //else
  return defaultResult;
}

/**
 * Calculates the greatest common divisor (GCD) of two numbers.
 * see: https://luqmanshaban.medium.com/finding-the-greatest-common-divisor-of-strings-in-typescript-bddcc0bbe2bc
 * @param a The first number.
 * @param b The second number.
 * @returns The greatest common divisor.
 */
function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}