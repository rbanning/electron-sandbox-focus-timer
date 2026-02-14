import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus } from '@services/task/task.model';
import { taskStatusColorTuple } from './task-status-color-tuple';

@Component({
  selector: 'app-task-status-horizontal-border',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [title]="status()" 
      class="absolute bottom-0 left-0 w-full h-2 opacity-80 group-hover:opacity-100 transition-opacity duration-1000 z-2"
      [style.backgroundColor]="color()"
    >
      <span class="sr-only">{{status()}}</span>
    </div>
  `,
  styles: ':host { display: block; }'
})
export class TaskStatusHorizontalBorderComponent {

  status = input.required<TaskStatus>();
  protected color = computed(() => taskStatusColorTuple[this.status()][1]);  //get the secondary color

}
