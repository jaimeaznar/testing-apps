export const subtractDate = (value: Date, days: number) => {
  const date = new Date(value.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};

export const getDatesBetweenRange = (startDate: Date, endDate: Date) => {
  const dateArray = new Array();
  let currentDate = startDate;
  while (currentDate >= endDate) {
    dateArray.push(new Date(currentDate).toISOString().slice(0, 10));
    currentDate = subtractDate(currentDate, 1);
  }
  return dateArray;
};

export const getWeeksBetweenRange = (
  startDate: string | Date,
  endDate: string | Date,
) => {
  let current = new Date(endDate);
  const weeks: [string][] = [];
  let week: string[] = [];

  while (current <= startDate) {
    week.push(new Date(current).toISOString().slice(0, 10));
    if (new Date(current).getDay() === 0) {
      weeks.push(week as any);
      week = [];
    }
    current = subtractDate(current, -1);
  }
  return weeks;
};

export const getMonthsBetween = (...args: any) => {
  let [a, b] = args.map((arg: any) =>
    arg
      .toISOString()
      .split('-')
      .slice(0, 2)
      .reduce((y: number, m: number) => m - 1 + y * 12),
  );

  return Array.from({ length: b - a + 1 }, (_) => a++).map(
    (element) =>
      ~~(element / 12) + '-' + ('0' + ((element % 12) + 1)).slice(-2),
  );
};

export const getDateOfWeek = (week: any, year: number) => {
  const day = 1 + (week - 1) * 7 + 1;
  return new Date(year, 0, day);
};

export const fillSingleNumberInDate = (value: number) =>
  value > 9 ? `${value}` : `0${value}`;
