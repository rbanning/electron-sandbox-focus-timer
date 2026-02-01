
export const timerUnits = ['second', 'minute', 'hour', 'day'];
export type TimerUnit = typeof timerUnits[number];

export type TimeObject = {value: number, unit: TimerUnit};