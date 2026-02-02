import { timeToSeconds } from "./time-to-seconds";
import { TimerUnit, TimeObject, timerUnits } from "./timer-unit.type";

/**
 * Keeping this function even though it is not used...
 * It was created using AI and it took three rounds of prompting
 *  and some tweaking on my part to get it to work.
 * 
 * The name of the function is misleading (it was `timerUnitConverter` which didn't explain much),
 * but it was suggested by AI
 * 
 * Original Prompt
 * Please complete the function timerUnitConverter that will convert the time object 
 * into the smallest whole number unit.  
 * For example, if value is 130 seconds, it will return 2.166 minutes, 
 * and if value is 130 minutes, it will return 2.166 hours, 
 * and if it is 130 hours, it will return 5.4166 days.
 * If the value is 59 seconds, it will return 59 seconds since it cannot be converted to a whole number minutes.
 */

const conversionFactors: Record<TimerUnit, number> = {
  second: 60,
  minute: 60,
  hour:   24,
  day: 1,
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