import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc' // import plugin
dayjs.extend(utc);


import { Nullable } from "../../types/nullable";
import { primitive } from "../primitive";
import { format } from "./formatters";

//todo: are we using this??
export type DateObject = {
  year?: number; 
  y?: number; 
  month?: number;
  M?: number;
  day?: number;
  d?: number;
  hour?: number;
  h?: number;
  minute?: number;
  m?: number;
  second?: number;
  s?: number;
  millisecond?: number;
  ms?: number;  
}

//#region >>> THE METHODS <<<

const now = (): dayjs.Dayjs => {
  return dayjs();
};

const utcFn = (): dayjs.Dayjs => {
  return dayjs.utc();
};

const isDayJs = (obj: Nullable<dayjs.Dayjs>): boolean => {
  return primitive.isDayJs(obj);
};

const toDayJs = (value: dayjs.ConfigType, defaultValue: Nullable<dayjs.Dayjs> = null) => {
  const ret: Nullable<dayjs.Dayjs> = primitive.isNotNullish(value) ? dayjs(value) : null;
  return isDayJs(ret) ? ret : defaultValue;
};

const toDayJsUtc = (value: dayjs.ConfigType, defaultValue: Nullable<dayjs.Dayjs> = null) => {
  const ret: Nullable<dayjs.Dayjs> = primitive.isNotNullish(value) ? dayjs.utc(value) : null;
  return isDayJs(ret) ? ret : defaultValue;
};

const isUtc = (obj: dayjs.Dayjs): boolean => {
  return isDayJs(obj) && obj.isUTC();
};


const toNiceString = (d: Nullable<dayjs.Dayjs>, inclTime: boolean = true) => {
  if (d && isDayJs(d)) {
    return inclTime ? d.local().format("ddd. MMM. DD, YYYY hh:mma") : d.local().format('ddd. MMM. DD, YYYY');
  }
  //else
  return '';

};

const toIsoString = (d: Nullable<dayjs.Dayjs>) => {
  if (d && isDayJs(d)) {
    return d.toISOString();
  }
  //else
  return '';
}

const compare = (d1: dayjs.Dayjs, d2: dayjs.Dayjs, handleNulls: 'first' | 'last' = 'first'): number => {
  if (d1?.isValid() && d2?.isValid()) {
    return d1.isBefore(d2) ? -1 : (d1.isAfter(d2) ? 1 : 0);
  } else {
    return (d1 === d2 ? 0 : (d1 ? 1 : -1)) * (handleNulls === 'last' ? -1 : 1);
  }
}

const isSameDay = (value1: dayjs.ConfigType, value2: dayjs.ConfigType): boolean => {
  const d1 = toDayJs(value1),
        d2 = toDayJs(value2);
  if (d1 && isDayJs(d1) && d2 && isDayJs(d2)) {
    return d1.isSame(d2, 'day');
  }
  //else
  return false;
}

const isFutureDate = (value: dayjs.ConfigType, nowValue?: dayjs.ConfigType): boolean => {
  const d = toDayJs(value),
    n = toDayJs(nowValue) || now();
  if (d && isDayJs(d) && n && isDayJs(n)) {
    return d.isAfter(n);
  }
  //else
  return false;
}


const isPastDue = (value: dayjs.ConfigType, nowValue?: dayjs.ConfigType): boolean => {
  const d = toDayJs(value),
        n = toDayJs(nowValue) || now();
  if (d && isDayJs(d) && n && isDayJs(n)) {
    return d.isBefore(n);
  }
  //else
  return false;
};

const _isWithin = (obj: dayjs.ConfigType, start: dayjs.ConfigType, end: dayjs.ConfigType): boolean => {
  const d = toDayJs(obj),
      s = toDayJs(start),
      e = toDayJs(end);
  if (d && isDayJs(d) && s && isDayJs(s) && e && isDayJs(e)) {
    return d.isAfter(s) && d.isBefore(e);
  }
  //else
  return false;
};

const isWithin = {
  thisWeek: (obj: dayjs.ConfigType): boolean => {
    return _isWithin(obj, dayjs().startOf('week'), dayjs().endOf('week'));
  },
  nextWeek: (obj: dayjs.ConfigType): boolean => {
    return _isWithin(obj, dayjs().add(1, 'week').startOf('week'), dayjs().add(1, 'week').endOf('week'));
  },
  thisMonth: (obj: dayjs.ConfigType): boolean => {
    return _isWithin(obj, dayjs().startOf('month'), dayjs().endOf('month'));
  },
  nextMonth: (obj: dayjs.ConfigType): boolean => {
    return _isWithin(obj, dayjs().add(1, 'month').startOf('month'), dayjs().add(1, 'month').endOf('month'));
  },
  lastWeek: (obj: dayjs.ConfigType): boolean => {
    return _isWithin(obj, dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week'));
  },
  lastMonth: (obj: dayjs.ConfigType): boolean => {
    return _isWithin(obj, dayjs().subtract(1, 'week').startOf('month'), dayjs().subtract(1, 'week').endOf('month'));
  },  
};

const difference = (value1: dayjs.ConfigType, value2: dayjs.ConfigType, units: 'day' | 'hour' | 'minute' | 'second'): number => {
  const v1 = dayjs(value1),
    v2 = dayjs(value2);
  if (v1 && isDayJs(v1) && v2 && isDayJs(v2)) {
    const ms = v1.diff(v2, 'millisecond');  //difference in milliseconds
    switch (units) {
      case 'day':
        return Math.floor(ms / (1000 * 60 * 60 * 24));
      case 'hour':
        return Math.floor(ms / (1000 * 60 * 60));
      case 'minute':
        return Math.floor(ms / (1000 * 60));
      case 'second':
        return Math.floor(ms / (1000));
      default:
        return ms;
    }
  }
  //else
  return 0; //false?

}


const min = (): dayjs.Dayjs => {
  return dayjs('1900-01-01T00:00:00.000Z');
}

//#endregion

export const dayjsHelp = {
  now,
  utc: utcFn, //need alias
  isDayJs,
  toDayJs,
  toDayJsUtc,
  isUtc,
  toNiceString,
  toIsoString,
  compare,  //sorting
  isSameDay,
  isFutureDate,
  isPastDue,
  isWithin,
  difference,
  min,
  format
};