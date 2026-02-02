
export const timerUnits = ['second', 'minute', 'hour', 'day'] as const;
export type TimerUnit = typeof timerUnits[number];

export type TimeObject = {value: number, unit: TimerUnit};