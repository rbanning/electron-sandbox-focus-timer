export const timerViews = ['ring', 'bar', 'fill'] as const;
export type TimerView = typeof timerViews[number];
