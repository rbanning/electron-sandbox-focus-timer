import { timeToSeconds } from "./time-to-seconds";
import { TimerUnit, TimeObject, timerUnits } from "./timer-unit.type";

const conversionFactors: Record<string, number> = {
  second: 60,
  minute: 60,
  hour:   24,
};


export function toSmallestWholeValue(time: TimeObject): TimeObject {
  let value = timeToSeconds(time);
  let unitIndex = 0; // start at seconds

  while (unitIndex < timerUnits.length - 1) {
    const converted = value / conversionFactors[timerUnits[unitIndex]];

    if (converted >= 1) {
      value = converted;
      unitIndex++;
    } else {
      break;
    }
  }

  return { value, unit: timerUnits[unitIndex] };
}