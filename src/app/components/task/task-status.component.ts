import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faCircle, faCircleCheck, faCircleDot, faCircleExclamation, faCircleMinus, faCircleXmark, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { ProjectStatus } from '@services/project/project.model';
import { TaskStatus } from '@services/task/task.model';
import { taskStatusColorTuple } from './task-status-color-tuple';

@Component({
  selector: 'app-task-status',
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
export class TaskStatusComponent {

  status = input.required<ProjectStatus>();
  size = input<SizeProp>('sm');

  icons: Record<TaskStatus, IconDefinition> = {
    pending: faCircle,
    active: faCircleDot,
    hold: faCircleMinus,
    issue: faCircleExclamation,
    completed: faCircleCheck,
    cancelled: faCircleXmark,
  }

  colors = taskStatusColorTuple;
}
