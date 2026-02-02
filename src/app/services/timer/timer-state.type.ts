export const timerStates = ['idle', 'running', 'paused', 'completed'] as const;
export type TimerState = typeof timerStates[number];
