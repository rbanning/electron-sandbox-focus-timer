import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus, taskStatusList } from '@services/task/task.model';
import { TaskStatusComponent } from './task-status.component';

@Component({
  selector: 'app-task-list-filter-status',
  standalone: true,
  imports: [CommonModule, TaskStatusComponent],
  template: `
  <span class="label">Status:</span>
  <button type="button" [disabled]="items().length === 0" (click)="reset()" class="btn sm mr-2">
    reset
  </button>
  @for (item of items(); track item) {
    <button type="button" (click)="toggle(item)" class="btn" [class.active]="filters().includes(item)">
      <app-task-status [status]="item" size="1x" />
    </button>
  }
  `,
  styleUrls: ['../common/list-filter-styles.css'],
})
export class TaskListFilterStatusComponent {

  @Output()
  filterUpdated = new EventEmitter<TaskStatus[]>();
  
  protected items = signal<readonly TaskStatus[]>(taskStatusList);
  protected filters = signal<readonly TaskStatus[]>([]); //start with none selected

  toggle(item: TaskStatus) {
    this.filters.update(items => {
      if (items.includes(item)) {
        return items.filter(m => m !== item);
      }
      else {
        return [...items, item];
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
}
