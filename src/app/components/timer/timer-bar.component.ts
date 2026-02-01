import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeFormatter } from './time-formatter';


@Component({
  selector: 'app-timer-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-bar.component.html',
  styleUrls: ['./timer-bar.component.css']
})
export class TimerBarComponent {

  //inputs
  remaining = input<number>(0);
  percent = input<number>(0);

  //computed
  roundedRemaining = computed(() => timeFormatter.remaining(this.remaining()));
  roundedPercent = computed(() => timeFormatter.percent(this.percent()));
  barStyles = computed(() => {
    return {
      'width': `${this.percent()}%`
    }
  });
  textStyles = computed(() => {
    return {
      //'left': `${this.percent()}%`
    }
  });

}
