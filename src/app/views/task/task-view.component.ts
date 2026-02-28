import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '@components/task/task-list.component';
import { TaskKanbanComponent } from '@components/task/task-kanban.component';
import { gridListFormats } from '@components/common/format-grid-list.type';
import { ProjectTaskDashboardComponent } from '@components/dashboard/project-task-dashboard.component';

const viewList = ['Dashboard', 'Kanban', ...gridListFormats] as const;
type View = typeof viewList[number];

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskKanbanComponent, 
    ProjectTaskDashboardComponent],
  templateUrl: './task-view.component.html',
  styles: ':host { display: block; }'
})
export class TaskViewComponent {

  protected view = signal<View>(viewList[0]);

  protected views = [...viewList];


}
