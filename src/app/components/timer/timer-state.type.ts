export const timerStates = ['idle', 'running', 'paused', 'complete'] as const;
export type TimerState = typeof timerStates[number];
