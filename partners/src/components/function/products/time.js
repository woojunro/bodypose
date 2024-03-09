export const splitMinutesToHoursMinutes = (minutes = 0) => ({
  hours: Math.floor(minutes / 60),
  minutes: minutes % 60,
});

export const combineHoursMinutesToMinutes = (hours = 0, minutes = 0) =>
  hours * 60 + minutes;
