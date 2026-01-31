import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandComponent } from '@components/brand/brand.component';
import { TimerState } from '@components/timer/timer-state.type';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CommonModule, BrandComponent],
  templateUrl: './home-view.component.html',
  styles: ':host { display: block; }'
})
export class HomeViewComponent {
  protected state = signal<TimerState>('idle');
}
