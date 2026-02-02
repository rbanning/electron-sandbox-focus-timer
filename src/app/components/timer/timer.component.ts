import { Component, inject, input, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faPause, faPlay, faStop, faPowerOff } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { strHelp } from '@common/general';
import { TimerFillComponent } from './timer-fill.component';
import { TimerBarComponent } from './timer-bar.component';
import { TimerRingComponent } from './timer-ring.component';
import { TimerService } from '@services/timer/timer.service';
import { TimerPopupEditorComponent } from './timer-popup-editor.component';

const timerViews = ['ring', 'bar', 'fill'] as const;
type TimerView = typeof timerViews[number];


@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, 
    TimerBarComponent, TimerRingComponent, TimerFillComponent, 
    TimerPopupEditorComponent,
    FontAwesomeModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnDestroy {

  // signals
  protected view = signal<TimerView>(timerViews[0]);
  protected views = signal(timerViews);

  protected capitalize = strHelp.capitalize;

  protected icons = {
    start: faPlay,
    pause: faPause,
    stop: faStop,
    reset: faPowerOff,
  }

  //timer service
  protected readonly timer = inject(TimerService);


  setView(view: TimerView) {
    this.view.set(view);
  }


  ngOnDestroy(): void {
    this.timer.reset();
  }
  
}
