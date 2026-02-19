import { booleanAttribute, Component, input, computed, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask, Task } from '@services/task/task.model';
import { TaskStatusComponent } from './task-status.component';
import { TaskDateComponent } from './task-date.component';
import { TaskStatusHorizontalBorderComponent } from './task-status-horizontal-border.component';
import { ProjectMiniCardComponent } from '@components/project/project-mini-card.component';
import { TaskPopupEditorComponent } from './task-popup-editor.component';
import { Router } from '@angular/router';
import { faSquareInfo } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,
    TaskStatusComponent, TaskDateComponent, 
    TaskStatusHorizontalBorderComponent, TaskPopupEditorComponent,
    ProjectMiniCardComponent
  ],
  template: `
    @if (isValid()) {
    <div class="group relative p-2 pl-4 pb-4 border border-slate-300 bg-slate-50 rounded-md shadow-md overflow-hidden" [attr.data-id]="task().id">      
      <div class="flex gap-1">
        <div class="flex-1">
          <div class="flex items-center gap-1">
            <div class="flex-1 font-semibold text-lg leading-5 text-slate-700">{{task().name}}</div>
            <app-task-status [status]="task().status" />
          </div>
          <div class="">
            {{task().type}}
          </div>
          <div class="">
            @if (task().project) {
              <app-project-mini-card [project]="task().project!" />
            }
            @else {
              <span class="text-slate-400">no project</span>
            }
          </div>
          <div class="flex items-center">
            <div class="-space-y-1 flex-1">
              <app-task-date [date]="task().reminder" type="reminder" />
              <app-task-date [date]="task().lastUpdated" type="updated" />
            </div>
            @if(!noDetails()) {
              <button 
                type="button"
                title="View Details"
                (click)="details()"
                class="p-2 border border-slate-50 hover:bg-slate-100 rounded"
              >
                <fa-duotone-icon [icon]="icons.details" size="2x" [secondaryOpacity]="0.1" />
              </button>
            }
          </div>
        </div>
        @if (!readonly()) {
          <app-task-popup-editor [task]="task()" (save)="saveEdits($event)" />
        }
      </div>
      <app-task-status-horizontal-border [status]="task().status" />
    </div>
    }
  `,
  styles: ':host { display: block; }'
})
export class TaskCardComponent {

  //input
  task = input.required<ITask>();
  readonly = input(false, { transform: booleanAttribute });
  noDetails = input(false, { transform: booleanAttribute });

  //output
  save = output<ITask>();

  protected isValid = computed(() => Task.isTask(this.task()));

  private route = inject(Router);

  icons = {
    details: faSquareInfo,
  };

  saveEdits (task: ITask) {
    console.log('DEBUG: change (task card)', task);
    this.save.emit(task);  //pass to parent;
  }

  details() {
    this.route.navigate(['/tasks', this.task().id]);
  }
}
