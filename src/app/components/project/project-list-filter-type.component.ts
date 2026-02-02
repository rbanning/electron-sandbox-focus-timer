import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectType, projectTypeList } from '@services/todo/project.model';
import { ProjectTypeComponent } from './project-type.component';

@Component({
  selector: 'app-project-list-filter-type',
  standalone: true,
  imports: [CommonModule, ProjectTypeComponent],
  template: `
<div class="flex flex-wrap gap-2">
  <button type="button" [disabled]="items().length === 0" (click)="reset()" class="btn sm mr-2">
    reset
  </button>
  @for (item of items(); track item) {
    <button type="button" (click)="toggle(item)" class="btn" [class.active]="filters().includes(item)">
      <app-project-type [type]="item" size="1x" />    
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
export class ProjectListFilterTypeComponent {

  @Output()
  filterUpdated = new EventEmitter<ProjectType[]>();
  
  protected items = signal<readonly ProjectType[]>(projectTypeList);
  protected filters = signal<readonly ProjectType[]>([]); //start with none selected

  toggle(item: ProjectType) {
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
