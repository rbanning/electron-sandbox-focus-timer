import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faPause, faPlay, faStop, faPowerOff } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { strHelp } from '@common/general';
import { TimerService } from '@services/timer/timer.service';

import { TimerFillComponent } from './timer-fill.component';
import { TimerBarComponent } from './timer-bar.component';
import { TimerRingComponent } from './timer-ring.component';
import { TimerPopupEditorComponent } from './timer-popup-editor.component';


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

  protected capitalize = strHelp.capitalize;

  protected icons = {
    start: faPlay,
    pause: faPause,
    stop: faStop,
    reset: faPowerOff,
  }

  //timer service
  protected readonly timer = inject(TimerService);

  ngOnDestroy(): void {
    this.timer.reset();
  }
  
}
