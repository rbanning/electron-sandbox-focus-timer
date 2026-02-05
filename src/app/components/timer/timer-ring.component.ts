import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-ring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-ring.component.html',
  styleUrls: ['./timer-ring.component.css']
})
export class TimerRingComponent {

  //inputs
  formattedRemaining = input<string>('');  //formatted time remaining
  roundedPercent = input<string>('');     //formatted remaining percent
  percent = input<number>(0);     
  
  // SVG circle circumference (radius = 50, so C = 2πr ≈ 314.16)
  circumference = 314.16;
  
  // Calculate stroke-dashoffset based on percent
  strokeDashoffset = computed(() => {
    const dashoffset = this.circumference - (this.percent() / 100) * this.circumference;
    return dashoffset;
  });
}
