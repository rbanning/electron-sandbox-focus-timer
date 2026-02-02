import { primitive, strHelp } from "@common/general"
import { isTimeObject, TimeObject } from "./time-object.type"
import { TimerView, timerViews } from "./timer-view.type"

export type TimerStore = {
  time: TimeObject,
  view: TimerView
}

export function isTimerStore(obj: unknown): obj is TimerStore {
  if (primitive.isObject(obj)) {
    return ('time' in obj && isTimeObject(obj['time']))
      && ('view' in obj && strHelp.isStringUnionType<TimerView>(obj['view'], timerViews));
  }
  //else
  return false;
}