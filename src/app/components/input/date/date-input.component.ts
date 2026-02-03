import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';

import { 
  faCalendar as calendarIcon,
  faCheckCircle as saveIcon,
  faCircleXmark as cancelIcon,
  faCalendarDay as todayIcon,
  
} from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Nullable } from '@common/types';
import { dayjsHelp, parsers, primitive } from '@common/general';
import { exhaustiveCheck } from '@common/misc';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.css',
})
export class DateInputComponent {

  //input
  originalDate = input<Nullable<dayjs.ConfigType>>(null, {
    alias: 'date'
  });
  css = input(""); // can we add css to an element?

  //output
  change = output<Nullable<dayjs.Dayjs>>();

  // state
  protected readonly active = signal(false);

  // dayjs date parts for saving the changes
  protected readonly day = signal<Nullable<number>>(null);
  protected readonly month = signal<Nullable<number>>(null);
  protected readonly year = signal<Nullable<number>>(null);

  protected readonly date = computed(() => {
    const parts = [this.year(), this.month(), this.day()];
    if (parts.every(m => primitive.isNumber(m))) {
      return parsers.toDayjs(parts.join('-'));
    }
    //else
    return undefined;
  });

  protected readonly monthText = computed(() => {
    const m = this.month() ?? 100;
    return this.months[m] ?? 'mm';
  });


  protected readonly daysInMonth = computed(() => {
    const d = this.date();
    return dayjsHelp.isDayJs(d)
      ? d.daysInMonth()
      : 31; //max
  })
  protected months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


  icons = {
    calendar: calendarIcon,
    save: saveIcon,
    cancel: cancelIcon,
    today: todayIcon,
  }

  constructor() {
    effect(() => {
      this._init();
    });
  }


  // methods

  update(key: 'day' | 'month' | 'year', value: unknown) {
    const num = parsers.toInt(value);
    switch(key) {
      case 'day': 
        this.day.set(num);
        break;
      case 'month': 
        this.month.set(num);
        break;
      case 'year': 
        this.year.set(num);
        break;

      default:
        exhaustiveCheck(key);
    }

    console.log("DEBUG: ", {key, value, values: [this.day(), this.month(), this.year()], date: this.date()})
  }

  done() {
    this.change.emit(this.date());
    this.active.set(false);
  }

  cancel() {
    this._init();
    this.active.set(false);
  }

  today() {
    this._init(dayjsHelp.now());
  }

  toggle() {
    this.active.update(v => !v);
  }

  // private methods
  private _init(d?: Nullable<dayjs.Dayjs>) {
    d ??= parsers.toDayjs(this.originalDate());
    if (dayjsHelp.isDayJs(d)) {
      this.day.set(d.date());
      this.month.set(d.month());
      this.year.set(d.year());
    }
    else {
      this.day.set(null);
      this.month.set(null);
      this.year.set(null);
    }
  }

}
