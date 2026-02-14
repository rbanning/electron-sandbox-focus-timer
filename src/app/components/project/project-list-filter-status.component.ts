import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatus, projectStatusList } from '@services/project/project.model';
import { ProjectStatusComponent } from './project-status.component';

@Component({
  selector: 'app-project-list-filter-status',
  standalone: true,
  imports: [CommonModule, ProjectStatusComponent],
  template: `
  <span class="label">Status:</span>
  <button type="button" [disabled]="items().length === 0" (click)="reset()" class="btn sm mr-2">
    reset
  </button>
  @for (item of items(); track item) {
    <button type="button" (click)="toggle(item)" class="btn" [class.active]="filters().includes(item)">
      <app-project-status [status]="item" size="1x" />
    </button>
  }
  `,
  styleUrls: ['../common/list-filter-styles.css'],
})
export class ProjectListFilterStatusComponent {

  @Output()
  filterUpdated = new EventEmitter<ProjectStatus[]>();
  
  protected items = signal<readonly ProjectStatus[]>(projectStatusList);
  protected filters = signal<readonly ProjectStatus[]>([]); //start with none selected

  toggle(item: ProjectStatus) {
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
