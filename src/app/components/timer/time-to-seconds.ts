import { primitive } from "@common/general";
import { TimeObject, TimerUnit } from "./timer-unit.type";



export function timeToSeconds(value: TimeObject): number;
export function timeToSeconds(value: number, unit: TimerUnit): number;
export function timeToSeconds(value: TimeObject | number, unit?: TimerUnit): number {
  unit = primitive.isNumber(value)
    ? (unit)
    : value.unit;
  const num = primitive.isNumber(value)
    ? value
    : value.value;

  switch (unit) {
    case 'second':
      return num;
    case 'minute':
      return num * 60;
    case 'hour':
      return num * 60 * 60;
    case 'day':
      return num * 60 * 60 * 24;
    default:
      throw new Error("timerToSeconds() requires a unit");
  }
}
