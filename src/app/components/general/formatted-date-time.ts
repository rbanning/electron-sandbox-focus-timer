import dayjs from 'dayjs';
import { booleanAttribute, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarClock, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { Nullable } from '@common/types';
import { dayjsHelp } from '@common/general';

@Component({
  selector: 'app-formatted-date-time',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <span 
      [class]="'inline-flex items-center gap-1 text-sm font-mono ' + (css())" 
      [title]="type() + ' date'"
      [attr.data-date-value]="isValid() ? date()?.toISOString() : ''"
      [attr.data-date-type]="type()"
    >
      @if (icon()) {
        <fa-duotone-icon [icon]="icon() ?? defaultIcon" />
      }
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
export class FormattedDateTimeComponent {

  //input
  type = input<string>('general');
  date = input<Nullable<dayjs.Dayjs>>();
  icon = input<Nullable<IconDefinition>>();
  active = input(false, { transform: booleanAttribute });
  attention = input(false, { transform: booleanAttribute });

  //computed
  protected isValid = computed(() => dayjsHelp.isDayJs(this.date()));
  protected dateFormatted = computed(() => dayjsHelp.format.asDate(this.date(), ""));
  protected timeFormatted = computed(() => dayjsHelp.format.asTime(this.date(), ""));
  protected css = computed(() => {
    if (this.attention()) {
      return "text-amber-700 animate-pulse";
    }
    else if (this.active()) {
      return "text-blue-700 animate-pulse";
    }
    else {
      return "text-slate-500";
    }
  })
  //define default icon to keep typescript happy
  protected defaultIcon = faCalendarClock;
}
