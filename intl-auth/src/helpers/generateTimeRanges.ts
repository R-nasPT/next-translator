export type TimeRangeKey = 
  | `yesterday${number}PM` 
  | `today${number}PM`;

export type TimeRanges = Record<TimeRangeKey, Date>;

import { TimeRanges } from "@/types";

const getTimeRange = (hours: number, now: Date, isYesterday = false) => {
  const date = new Date(now);
  date.setDate(date.getDate() - (isYesterday ? 1 : 0));
  date.setHours(hours, 5, 0, 0);
  return date;
};

const generateTimeRanges = (now: Date): TimeRanges => {
  const ranges = [15, 14, 13, 12, 11, 10, 9, 8];
  return ranges.reduce(
    (acc, hour) => ({
      ...acc,
      [`yesterday${hour}PM`]: getTimeRange(hour, now, true),
      [`today${hour}PM`]: getTimeRange(hour, now),
    }),
    {} as TimeRanges // กำหนด type ชัดเจนว่าผลลัพธ์คือ TimeRanges
  );
};

export default generateTimeRanges;
