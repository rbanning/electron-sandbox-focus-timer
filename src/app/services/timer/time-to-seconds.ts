import { exhaustiveCheck } from "@common/misc";
import { TimerUnit } from "./timer-unit.type";
import { isTimeObject, TimeObject } from "./time-object.type";



export function timeToSeconds(value: TimeObject): number;
export function timeToSeconds(value: number, unit: TimerUnit): number;
export function timeToSeconds(value: TimeObject | number, unit?: TimerUnit): number {
  let num: number = 0;
  let u: TimerUnit = 'second';

  if (isTimeObject(value)) {
    u = value.unit;
    num = value.value;
  }
  else {
    u = unit ?? u;
    num = value;
  }

  switch (u) {
    case 'second':
      return num;
    case 'minute':
      return num * 60;
    case 'hour':
      return num * 60 * 60;
    case 'day':
      return num * 60 * 60 * 24;
    default:
      exhaustiveCheck(u);
  }
}
