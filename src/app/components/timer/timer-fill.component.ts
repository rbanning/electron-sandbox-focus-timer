import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-fill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-fill.component.html',
  styleUrls: ['./timer-fill.component.css'],
})
export class TimerFillComponent {

  //inputs
  formattedRemaining = input<string>('');  //formatted time remaining
  roundedPercent = input<string>('');     //formatted remaining percent
  percent = input<number>(0);     

  //computed
  fillStyles = computed(() => {
    return {
      'transform': `translateY(${100 - this.percent()}%)`,
      'opacity': `${this.percent()/100}`
    }
  });
}
