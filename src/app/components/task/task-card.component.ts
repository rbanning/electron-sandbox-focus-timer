import { booleanAttribute, Component, input, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask, Task } from '@services/task/task.model';
import { TaskStatusComponent } from './task-status.component';
import { TaskDateComponent } from './task-date.component';
import { TaskStatusHorizontalBorderComponent } from './task-status-horizontal-border.component';
import { ProjectMiniCardComponent } from '@components/project/project-mini-card.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, TaskStatusComponent, TaskDateComponent, 
    TaskStatusHorizontalBorderComponent,
    ProjectMiniCardComponent
  ],
  template: `
    @if (isValid()) {
    <div class="group relative p-2 pl-4 pb-4 border border-slate-300 bg-slate-50 rounded-md shadow-md overflow-hidden" [attr.data-id]="task().id">      
      <div class="flex items-center gap-1">
        <div class="flex-1 font-semibold text-lg leading-5 text-slate-700">{{task().name}}</div>
        <app-task-status [status]="task().status" />
        @if (!readonly()) {
          <!-- <app-project-popup-editor [project]="project()" (save)="saveEdits($event)" /> -->
        }
      </div>
      <div class="">
        @if (task().project) {
          <app-project-mini-card [project]="task().project!" />
        }
        @else {
          <span class="text-slate-400">no project</span>
        }
      </div>
      <div class="-space-y-1">
        <app-task-date [date]="task().reminder" type="reminder" />
        <app-task-date [date]="task().lastUpdated" type="updated" />
      </div>
      <app-task-status-horizontal-border [status]="task().status" />
    </div>
    }
  `,
  styles: ':host { display: block; }'
})
export class TaskCardComponent {

  task = input.required<ITask>();
  readonly = input(false, { transform: booleanAttribute });
  save = output<ITask>();

  protected isValid = computed(() => Task.isTask(this.task()));

  saveEdits (task: ITask) {
    console.log('DEBUG: change (task card)', task);
    this.save.emit(task);  //pass to parent;
  }
}
