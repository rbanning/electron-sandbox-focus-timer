import dayjs from 'dayjs';
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faBolt, faPersonRunning, faSquareQuestion, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { Nullable } from '@common/types';
import { FormattedDateTimeComponent } from '@components/general/formatted-date-time';


export type DateType = 'start' | 'updated' | 'unknown';

@Component({
  selector: 'app-project-date',
  standalone: true,
  imports: [CommonModule, FormattedDateTimeComponent],
  template: `
    <app-formatted-date-time [type]="type()" [date]="date()" [icon]="icons[type()]" />
  `,
  styles: ':host { display: block; }'
})
export class ProjectDateComponent {

  date = input<Nullable<dayjs.Dayjs>>();
  type = input<DateType>('unknown');
  
  icons: Record<DateType, IconDefinition> = {
    start: faPersonRunning,
    updated: faBolt,
    unknown: faSquareQuestion,
  }
}
