import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeFormatter } from './time-formatter';

@Component({
  selector: 'app-timer-fill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-fill.component.html',
  styleUrls: ['./timer-fill.component.css'],
})
export class TimerFillComponent {

  //inputs
  remaining = input<number>(0);
  percent = input<number>(0);

  //computed
  roundedRemaining = computed(() => timeFormatter.remaining(this.remaining()));
  roundedPercent = computed(() => timeFormatter.percent(this.percent()));
  fillStyles = computed(() => {
    return {
      'transform': `translateY(${100 - this.percent()}%)`,
      'opacity': `${this.percent()/100}`
    }
  });
}
