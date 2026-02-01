import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from '@components/timer/timer.component';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CommonModule, TimerComponent],
  templateUrl: './home-view.component.html',
  styles: ':host { display: block; }'
})
export class HomeViewComponent {}
