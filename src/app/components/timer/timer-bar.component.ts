import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-timer-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-bar.component.html',
  styleUrls: ['./timer-bar.component.css']
})
export class TimerBarComponent {

  //inputs
  formattedRemaining = input<string>('');  //formatted time remaining
  roundedPercent = input<string>('');     //formatted remaining percent
  percent = input<number>(0);     

  //computed
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
