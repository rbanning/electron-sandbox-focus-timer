import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faCircle, faCircleCheck, faCircleDot, faCircleExclamation, faCircleMinus, faCircleXmark, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { ProjectStatus } from '@services/todo/project.model';

@Component({
  selector: 'app-project-status',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <fa-duotone-icon
      [title]="status()" 
      [icon]="icons[status()]" 
      [size]="size()"
      [primaryColor]="colors[status()][0]"
      [secondaryOpacity]="0.7"
      [secondaryColor]="colors[status()][1]"
    />
    <span class="sr-only">{{status()}}</span>
  `,
  styles: ':host { display: block; }'
})
export class ProjectStatusComponent {

  status = input<ProjectStatus>('pending');
  size = input<SizeProp>('sm');

  icons: Record<ProjectStatus, IconDefinition> = {
    pending: faCircle,
    active: faCircleDot,
    hold: faCircleMinus,
    issue: faCircleExclamation,
    completed: faCircleCheck,
    cancelled: faCircleXmark,
  }

  colors: Record<ProjectStatus, [primary: string, secondary: string]> = {
    pending: ['gray', 'gray'],
    active: ['gray', 'cornflowerblue'],
    hold: ['gray', 'peru'],
    issue: ['gray', 'deeppink'],
    completed: ['gray', 'yellowgreen'],
    cancelled: ['gray', 'lightpink'],
  }

}
