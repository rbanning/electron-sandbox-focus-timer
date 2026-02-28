import dayjs from 'dayjs';
import { Component, computed, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dayjsHelp } from '@common/general';
import { ITask } from '@services/task/task.model';
import { taskStatusColorTuple } from '@components/task/task-status-color-tuple';

type DayBlock = {
  day: dayjs.Dayjs,
  title: string,
  color: string,
  active: boolean | null,
}

@Component({
  selector: 'app-project-task-week-flow',
  standalone: true,
  imports: [CommonModule],
  styles: ':host { display: block; position: relative; width: 100%; }',
  template: `
<div
  [title]="summary()"
  class="w-full h-4 grid grid-cols-20 overflow-hidden rounded-lg">
  @for(item of days(); track item) {
    <span
      [attr.data-day]="item.title"
      [attr.data-active]="item.active ?? 'n/a'"
      class="block w-full h-full" 
      [style.backgroundColor]="item.color"
      [style.opacity]="item.active === null ? 0.4 : 1"></span>
  }
</div>
  `,
})
export class ProjectTaskWeekFlowComponent {
  //inputs
  task = input.required<ITask>({ alias: "task"});
  startInput = input<dayjs.Dayjs>(dayjsHelp.now(), { alias: "start" });
  weeks = input(3);

  //internal signals
  start = signal<dayjs.Dayjs>(dayjsHelp.now());  //should always land on a Monday.
  end = signal<dayjs.Dayjs>(dayjsHelp.now());  //should always land on a Monday.
  
  //computed
  protected summary = computed(() => {
    const { startDate, endDate } = this.task();
    let ret = ``;
    if (startDate) {
      ret += ` start: ${dayjsHelp.format.asDate(startDate)}`;
      if (dayjsHelp.isDayJs(endDate)) {
        ret += ` and end: ${dayjsHelp.format.asDate(endDate)}`;
      }
      ret += ` --- Total of ${this.totalTaskDayCount()} days${endDate ? '.' : ' so far.'}`;
    }
    else {
      ret += ' no start date';
    }
    return ret;
  });

  protected days = computed<DayBlock[]>(() => {
    const ret = [];
    const { startDate, endDate, status } = this.task();
    const now = dayjsHelp.now();
    for (let i = 1; i < 7*this.weeks(); i++) {
      const day = this.start().add(i, 'day');
      const title = dayjsHelp.format.asDate(day);
      if (!startDate) {
        //nothing to do
        ret.push({
          day, 
          title,
          color: 'transparent',
          active: false,
        });
      }
      else {
        if (startDate > day || (endDate && endDate < day)) {
          //current day is before startDate or after endDate 
          ret.push({
            day, 
            title,
            color: 'transparent',
            active: false,
          });
        }
        else if (endDate && endDate > day) {
          //current day is before end date
          ret.push({
            day,
            title,
            color: taskStatusColorTuple[status][1],
            active: true,
          })
        }
        else if (startDate < day) {
          //day is in the future (maybe we will be still working)
          ret.push({
            day,
            title,
            color: taskStatusColorTuple[status][1],
            active: day < now ? true : null,
          })
        }
        else {
          //flag for un-handled situation
          ret.push({
            day,
            title,
            color: 'red',
            active: null,
          })
        }
      }
      
    }
    return ret;    
  });

  protected totalTaskDayCount = computed(() => {
    //total number of days the task has been working on...
    //  this means from the startDate to the endDate (or today if no endDate)
    const { startDate, endDate } = this.task();
    if (dayjsHelp.isDayJs(startDate)) {
      const end = dayjsHelp.isDayJs(endDate)
        ? endDate
        : dayjsHelp.now();
      //return number of days between start and end
      return dayjsHelp.difference(end, startDate, 'day');
    }
    //else - no start date, so no days
    return 0;
  })

  protected bg = computed(() => {
    return taskStatusColorTuple[this.task().status][1];
  });
  

  constructor() {
    effect(() => {
      this.start.set(dayjsHelp.moveToClosest('Monday', this.startInput()) ?? this.startInput());
      this.end.set(this.start().add(this.weeks(), 'week'));
    })
  }
}
