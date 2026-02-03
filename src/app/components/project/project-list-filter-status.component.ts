import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStatus, projectStatusList } from '@services/project/project.model';
import { ProjectStatusComponent } from './project-status.component';

@Component({
  selector: 'app-project-list-filter-status',
  standalone: true,
  imports: [CommonModule, ProjectStatusComponent],
  template: `
<div class="flex flex-wrap gap-2">
  <button type="button" [disabled]="items().length === 0" (click)="reset()" class="btn sm mr-2">
    reset
  </button>
  @for (item of items(); track item) {
    <button type="button" (click)="toggle(item)" class="btn" [class.active]="filters().includes(item)">
      <app-project-status [status]="item" size="1x" />
    </button>
  }
</div>
  `,
  styles: `
:host { 
  display: block; 
  .btn {
    border: solid 1px gray;
    padding: 0.1rem 0.7rem;
    border-radius: 1rem;
    background-color: white;
    &.active {
      border: solid 2px black;
      background-color: rgba(200,200,250,0.3);
    }
    &.sm {
      padding: 1px 3px;
      font-size: 0.8rem;
      border-radius: 4px;
    }
  }
}  
  `
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
