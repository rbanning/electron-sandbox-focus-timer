import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { timeFormatter } from './time-formatter';

@Component({
  selector: 'app-timer-ring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-ring.component.html',
  styleUrls: ['./timer-ring.component.css']
})
export class TimerRingComponent {

  //inputs
  remaining = input<number>(0); //seconds
  percent = input<number>(0);

  //computed
  formattedRemaining = computed(() => timeFormatter.remaining(this.remaining()));
  roundedPercent = computed(() => timeFormatter.percent(this.percent()));
  
  // SVG circle circumference (radius = 50, so C = 2πr ≈ 314.16)
  circumference = 314.16;
  
  // Calculate stroke-dashoffset based on percent
  strokeDashoffset = computed(() => {
    const dashoffset = this.circumference - (this.percent() / 100) * this.circumference;
    return dashoffset;
  });
}
