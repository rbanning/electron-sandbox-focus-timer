import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { parsers } from "../parsers";
import { isDayJsConfig } from "./is-dayjs-config";
dayjs.extend(relativeTime);

const DEFAULT_VALUE: string = '';

const formats = {
  date: 'MMM. DD, YYYY',
  time: 'h:mm A',
  input: 'YYYY-MM-DD', //used for <input type="date" />
}

export const format = {
  as: (value: unknown | null, formatPattern: string, defaultValue: string = DEFAULT_VALUE) => {
    if (value && isDayJsConfig(value)) {
      const d = parsers.toDayjs(value);
      if (d && d.isValid()) {
        return d.format(formatPattern);
      }
    }
    //else
    return defaultValue;
  },
  asDate: (value: unknown | null, defaultValue: string = DEFAULT_VALUE) => {
    return format.as(value, formats.date, defaultValue);
  },
  asTime: (value: unknown | null, defaultValue: string = DEFAULT_VALUE) => {
    return format.as(value, formats.time, defaultValue);
  },
  asDateTime: (value: unknown | null, defaultValue: string = DEFAULT_VALUE) => {
    return format.as(value, `${formats.date} ${formats.time}`, defaultValue);
  },
  asInput: (value: unknown | null, defaultValue: string = DEFAULT_VALUE) => {
    return format.as(value, formats.input, defaultValue);
  },
  fromNow: (value: unknown | null, withoutSuffix?: boolean, defaultValue: string = DEFAULT_VALUE) => {
    if (value && isDayJsConfig(value)) {
      const d = parsers.toDayjs(value);
      if (d && d.isValid()) {
        return d.fromNow(withoutSuffix);
      }
    }
    //else
    return defaultValue;
  },
  toNow: (value: unknown | null, withoutSuffix?: boolean, defaultValue: string = DEFAULT_VALUE) => {
    if (value && isDayJsConfig(value)) {
      const d = parsers.toDayjs(value);
      if (d && d.isValid()) {
        return d.toNow(withoutSuffix);
      }
    }
    //else
    return defaultValue;
  },
  ago: (value: unknown | null, maxDays: number = 10, withoutSuffix: boolean = false, defaultValue: string = DEFAULT_VALUE) => {
    if (value && isDayJsConfig(value)) {
      const d = parsers.toDayjs(value);
      if (d && d.isValid()) {
        return (d.add(-1* maxDays, 'days').isBefore()) 
          ? format.fromNow(value, withoutSuffix, defaultValue)
          : format.asDate(value, defaultValue);
      }
    }
    //else
    return defaultValue;
  }
}