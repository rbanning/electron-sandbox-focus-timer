import { primitive, strHelp } from "@common/general";
import { TimerUnit, timerUnits } from "./timer-unit.type";

export type TimeObject = {value: number, unit: TimerUnit};

export function isTimeObject(obj: unknown): obj is TimeObject {
  if (primitive.isObject(obj)) {
    return ('value' in obj && primitive.isNumber(obj['value']))
      && ('unit' in obj && strHelp.isStringUnionType<TimerUnit>(obj['unit'], timerUnits));
  }
  //else
  return false;
}