export const timeFormatter = {
  remaining,
  percent
} as const;

function remaining(value: number) {
  if (value < 0.1) {
    return "0";
  }
  else if (value < 2) {
    return value.toFixed(2);
  }
  //else
  return Math.floor(value).toFixed(0);
}
function percent(value: number) {
  return Math.floor(value).toFixed(0);
}