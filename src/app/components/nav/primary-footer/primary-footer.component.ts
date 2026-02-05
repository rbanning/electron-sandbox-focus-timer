import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@src/environments/environment';
import { TimerService } from '@services/timer/timer.service';

@Component({
  selector: 'app-primary-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primary-footer.component.html',
  styles: ':host { display: block; }'
})
export class PrimaryFooterComponent {
  protected readonly copyright = signal(environment.copyright);
  protected readonly version = signal(environment.version);
  protected readonly date = signal(new Date().getFullYear());

  protected timer = inject(TimerService);
}
