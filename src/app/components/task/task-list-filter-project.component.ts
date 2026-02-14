import { Component, EventEmitter, Output, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMiniCardComponent } from '@components/project/project-mini-card.component';
import { IProject } from '@services/project/project.model';
import { ProjectService } from '@services/project/project.service';
import { TaskService } from '@services/task/task.service';

@Component({
  selector: 'app-task-list-filter-project',
  standalone: true,
  imports: [CommonModule, ProjectMiniCardComponent],
  template: `
  <span class="label">Projects:</span>
  <button type="button" [disabled]="items().length === 0" (click)="reset()" class="btn sm mr-2">
    reset
  </button>
  @for (item of items(); track item) {
    <button type="button" (click)="toggle(item)" class="btn" [class.active]="filters().includes(item.id)">
      <app-project-mini-card [project]="item" />    
    </button>
  }
  `,
  styleUrls: ['../common/list-filter-styles.css'],
})
export class TaskListFilterProjectComponent {

  @Output()
  filterUpdated = new EventEmitter<string[]>();
  
  protected items = signal<readonly IProject[]>([]);
  protected filters = signal<readonly string[]>([]); //start with none selected

  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  constructor() {
    effect(() => {
      const projectIds = this.taskService.tasks().map(m => m.projectId);
      this.items.set(this.projectService.projects().filter(m => projectIds.includes(m.id)));
    });
  }

  toggle(item: IProject) {
    this.filters.update(ids => {
      if (ids.includes(item.id)) {
        return ids.filter(m => m !== item.id);
      }
      else {
        return [...ids, item.id];
      }
    });

    //notify parent
    this.filterUpdated.emit([...this.filters()]);
  }

  reset() {
    this.filters.set([]);
    //notify parent
    this.filterUpdated.emit([...this.filters()]);
  }

  refresh() {

  }
}
