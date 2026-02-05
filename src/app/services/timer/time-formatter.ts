export const timeFormatter = {
  remaining,
  percent,
} as const;

//convert seconds to H:MM:SS
function remaining(totalSeconds: number) {
  if (totalSeconds < 1) {
    return '0:00:00';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes.toFixed(0).padStart(2, '0')}:${seconds.toFixed(0).padStart(2, '0')}`;
}

//convert percent to whole number by dropping decimal
function percent(value: number) {
  return Math.floor(value).toFixed(0);
}
