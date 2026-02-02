import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from '@common/types';
import dayjs from 'dayjs';
import { dayjsHelp } from '@common/general';
import { faBolt, faPersonRunning, faSquareQuestion, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


export type DateType = 'start' | 'updated' | 'unknown';

@Component({
  selector: 'app-project-date',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <span 
      class="inline-flex items-center gap-1 text-sm text-slate-500 font-mono" 
      [title]="type() + ' date'"
      [attr.data-date-value]="date()?.toISOString()"
      [attr.data-date-type]="type()"
    >
      <fa-duotone-icon [icon]="icons[type()]" />
      @if(isValid()) {
        <span class="word-spacing-tightest">{{dateFormatted()}}</span>
        <span class="word-spacing-tightest">{{timeFormatted()}}</span>      
      }
      @else {
        <span>n/a</span>
      }
    </span>
  `,
  styles: ':host { display: block; }'
})
export class ProjectDateComponent {

  date = input<Nullable<dayjs.Dayjs>>();
  type = input<DateType>('unknown');
  isValid = computed(() => dayjsHelp.isDayJs(this.date()));

  dateFormatted = computed(() => dayjsHelp.format.asDate(this.date(), ""));
  timeFormatted = computed(() => dayjsHelp.format.asTime(this.date(), ""));

  icons: Record<DateType, IconDefinition> = {
    start: faPersonRunning,
    updated: faBolt,
    unknown: faSquareQuestion,
  }
}
