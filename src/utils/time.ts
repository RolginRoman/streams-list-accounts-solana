export function minutesInSeconds(minutes: number): number {
  return minutes * 60;
}

export function minutesFromNow(minutes: number): number {
  return Math.round(new Date().getTime() / 1000) + minutesInSeconds(minutes);
}
