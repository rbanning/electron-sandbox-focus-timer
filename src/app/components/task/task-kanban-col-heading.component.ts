import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus } from '@services/task/task.model';
import { taskStatusColorTuple } from './task-status-color-tuple';
import { strHelp } from '@common/general';

@Component({
  selector: 'app-task-kanban-col-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-2 font-bold text-xl text-slate-700 text-center border-b-4"
      [style.borderColor]="color()"
    >
    {{label()}} <span>({{count()}})</span>
    </div>
  `,
  styles: ':host { display: block; }'
})
export class TaskKanbanColHeadingComponent {

  status = input.required<TaskStatus>();
  count = input.required<number>();
  label = computed(() => strHelp.capitalize(this.status(), true));
  protected color = computed(() => taskStatusColorTuple[this.status()][1]);  //get the secondary color
}
