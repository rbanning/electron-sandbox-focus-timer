import dayjs from 'dayjs';
import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faAlarmClock, faBold, faFlagCheckered, faSneakerRunning, faSquareQuestion, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { Nullable } from '@common/types';
import { FormattedDateTimeComponent } from '@components/general/formatted-date-time';
import { dayjsHelp } from '@common/general';

export type DateType = 'reminder' | 'updated' | 'start' | 'end' | 'unknown';

@Component({
  selector: 'app-task-date',
  standalone: true,
  imports: [CommonModule, FormattedDateTimeComponent],
  template: `
    <app-formatted-date-time [type]="type()" [date]="date()" [icon]="icons[type()]" [active]="active()" [attention]="attention()" />
  `,
  styles: ':host { display: block; }'
})
export class TaskDateComponent {

  date = input<Nullable<dayjs.Dayjs>>();
  type = input<DateType>('unknown');
  
  protected active = computed(() => {
    if (dayjsHelp.isDayJs(this.date())) {
      return this.type() === 'reminder' && dayjsHelp.isFutureDate(this.date());
    }
    //else
    return false;
  })
  protected attention = computed(() => {
    if (dayjsHelp.isDayJs(this.date())) {
      return this.type() === 'reminder' 
        && dayjsHelp.isFutureDate(this.date())
        && !dayjsHelp.isFutureDate(this.date(), dayjsHelp.now().add(1, 'day'));
    }
    //else
    return false;
  })

  icons: Record<DateType, IconDefinition> = {
    reminder: faAlarmClock,
    updated: faBold,
    unknown: faSquareQuestion,
    start: faSneakerRunning,
    end: faFlagCheckered,
  }
  

}
