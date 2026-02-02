import { Component, computed, input, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAlarmClock } from '@fortawesome/pro-duotone-svg-icons';
import { environment } from '@src/environments/environment';
import { TimerState } from '@services/timer/timer-state.type';



@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './brand.component.html',
  styles: []
})
export class BrandComponent {
  //inputs
  state = input<TimerState>('idle');
  noIcon = input<boolean>(false);
  
  //constants
  protected readonly title = signal(environment.appTitle);
  protected readonly icon = faAlarmClock;

  //computed signals
  color = computed(() => {
    switch(this.state()) {
      case 'idle':
        return { primary: 'black', secondary: 'gray' };
      case 'running':
        return { primary: 'steelblue', secondary: 'gray' };
      case 'paused':
        return { primary: 'darkmagenta', secondary: 'gray' };
      case 'complete':
        return { primary: 'limegreen', secondary: 'gray' };      
    }
  })
}
