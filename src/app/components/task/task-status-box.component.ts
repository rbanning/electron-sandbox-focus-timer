import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus } from '@services/task/task.model';
import { taskStatusColorTuple } from './task-status-color-tuple';

@Component({
  selector: 'app-task-status-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [title]="status()" 
      class="inline-block w-full h-full rounded"
      [style.backgroundColor]="color()"
    >
      <span class="sr-only">{{status()}}</span>
    </span>
  `,
  styles: ':host { display: inline-block; width: 1em; height: 1em; }'
})
export class TaskStatusBoxComponent {

  status = input.required<TaskStatus>();
  protected color = computed(() => taskStatusColorTuple[this.status()][1]);  //get the secondary color

}
