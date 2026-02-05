import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faCircleInfo, faMicroscope, faTarp, faTasks, faTimer, faXmarkSquare } from '@fortawesome/pro-duotone-svg-icons';
import { BrandComponent } from '@components/brand/brand.component';
import { TimerService } from '@services/timer/timer.service';

@Component({
  selector: 'app-primary-header',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, BrandComponent, FontAwesomeModule],
  templateUrl: './primary-header.component.html',
  styleUrl: './primary-header.component.css'
})
export class PrimaryHeaderComponent {
  protected active = signal(false);

  protected readonly timer = inject(TimerService); //used to update the brand based on state

  protected readonly primaryMenu = signal([
    { path: ['/'], title: 'Timer', icon: faTimer },
    { path: ['/tasks'], title: 'Tasks', icon: faTasks },
    { path: ['/projects'], title: 'Projects', icon: faTarp },
  ]);
  protected readonly secondaryMenu = signal([
    { path: ['/about'], title: 'About', icon: faCircleInfo },
    { path: ['/test'], title: 'Test', icon: faMicroscope }
  ]);

  icons = {
    menu: faBars,
    close: faXmarkSquare,
  }
  toggle() {
    this.active.update(v => !v);
  }
}
