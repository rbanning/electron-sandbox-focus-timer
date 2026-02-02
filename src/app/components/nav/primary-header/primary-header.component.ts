import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faXmarkSquare } from '@fortawesome/pro-duotone-svg-icons';
import { BrandComponent } from '@components/brand/brand.component';
import { TimerService } from '@services/timer/timer.service';

@Component({
  selector: 'app-primary-header',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, BrandComponent, FontAwesomeModule],
  templateUrl: './primary-header.component.html',
  styles: ':host { display: block; }'
})
export class PrimaryHeaderComponent {
  protected active = signal(false);

  protected readonly timer = inject(TimerService); //used to update the brand based on state

  icons = {
    menu: faBars,
    close: faXmarkSquare
  }
  toggle() {
    this.active.update(v => !v);
  }
}
