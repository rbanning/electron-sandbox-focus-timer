import dayjs from 'dayjs';
import { Component, computed, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dayjsHelp, objHelp } from '@common/general';
import { ITask, Task, TaskStatus } from '@services/task/task.model';
import { taskStatusColorTuple } from '@components/task/task-status-color-tuple';

type StatsStatusKeys = Extract<TaskStatus, 'active' | 'hold' | 'issue'>;
type StatsBlock = {[key in StatsStatusKeys]: number} & {
  started: number,
  ended: number,
};

type DayBlock = {
  day: dayjs.Dayjs,
  title: string,
  count: number;
  active: boolean,
  future: boolean,
  opacity: number,
}

@Component({
  selector: 'app-project-summary-week-flow',
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
      [attr.data-active]="item.active"
      [attr.data-future]="item.future"
      [class]="'block w-full h-full ' + (item.active ? (item.future ? 'bg-cyan-200' : 'bg-slate-400') : 'bg-transparent')"
      [style.opacity]="item.opacity"
    ></span>
  }
</div>
  `,
})
export class ProjectSummaryWeekFlowComponent {
  //inputs
  tasks = input.required<ITask[]>({ alias: "tasks"});
  startInput = input<dayjs.Dayjs>(dayjsHelp.now(), { alias: "start" });
  weeks = input(3);

  //internal signals
  start = signal<dayjs.Dayjs>(dayjsHelp.now());  //should always land on a Monday.
  end = signal<dayjs.Dayjs>(dayjsHelp.now());  //should always land on a Monday.
  
  //computed
  protected stats = computed(() => {
    const stats: StatsBlock = {
      active: 0,
      hold: 0,
      issue: 0,

      started: 0,
      ended: 0,
    };
    const windowStart = this.start();
    const windowEnd = this.end();

    for (const task of this.tasks()) {
      const { startDate, endDate } = task;
      if (startDate) {
        //only concerned if there is a start date
        if (['active', 'hold', 'issue'].includes(task.status)) {
          stats[task.status as StatsStatusKeys] += 1;
        }
        if (startDate >= windowStart && startDate <= windowEnd) {
          stats.started += 1;
        }
        if (endDate && endDate >= windowStart && endDate <= windowEnd) {
          stats.ended += 1;
        }
      }
    }
    
    return stats;
  });

  protected summary = computed(() => {
    const stats = this.stats();
    return objHelp.keysOf(stats).map(key => `${key}: ${stats[key]}`).join('; ');
  })

  protected days = computed<DayBlock[]>(() => {
    const tasks = this.tasks();
    const windowStart = this.start();
    const windowEnd = this.end();

    // Create day blocks
    const dayBlocks: DayBlock[] = [];
    const now = dayjsHelp.now();
    for (let i = 1; i < 7*this.weeks(); i++) {
      const day = this.start().add(i, 'day');
      const activeTasks = tasks.filter(task => {
        const { startDate, endDate } = task;
        return startDate 
          && startDate <= day
          && (!endDate || endDate > day); 
      })
      const active = activeTasks.length > 0;
      const title = dayjsHelp.format.asDate(day);
      dayBlocks.push({
        day, 
        title,
        count: activeTasks.length,
        active: Boolean(active),
        future: day >= now,
        opacity: 0,     //temp
      });
    }

    //Normalize counts to get opacity
    const maxCount = Math.max(...dayBlocks.map(m => m.count), 1); // avoid divide-by-zero
    const minOpacity = 0.15;  //ensure it is at least visible
    for(const current of dayBlocks) {
      current.opacity = Math.max(current.count / maxCount, minOpacity);
      if (current.future) {
        //future dates have an opacity capped at 50%
        current.opacity = Math.min(current.opacity, 0.5);
      }
    }

    return dayBlocks;    
  });

  constructor() {
    effect(() => {
      this.start.set(dayjsHelp.moveToClosest('Monday', this.startInput()) ?? this.startInput());
      this.end.set(this.start().add(this.weeks(), 'week'));
    })
  }
}
