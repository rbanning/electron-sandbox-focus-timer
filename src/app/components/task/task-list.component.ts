import { booleanAttribute, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faFilters, faSort } from '@fortawesome/pro-duotone-svg-icons';
import { arrayHelp, strHelp } from '@common/general';
import { SortInfo, TaskService } from '@services/task/task.service';
import { ProjectStatus, ProjectType, projectStatusList } from '@services/project/project.model';
import { ITask, Task } from '@services/task/task.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TaskListFilterStatusComponent } from './task-list-filter-status.component';
import { TaskListFilterProjectComponent } from './task-list-filter-project.component';
import { TaskListSortSelectorComponent } from './task-list-sort-selector.component';
import { TaskCardComponent } from './task-card.component';
import { GridListFormat } from '@components/common/format-grid-list.type';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,
    TaskListFilterStatusComponent, TaskListFilterProjectComponent,
    TaskListSortSelectorComponent,
    TaskCardComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['../common/format-grid-list.css'],
})
export class TaskListComponent {

  //task service
  private service = inject(TaskService);

  //input
  format = input<GridListFormat>('Grid');
  readonly = input(false, { transform: booleanAttribute });
  allowNew = input(true, { transform: booleanAttribute });

  protected newTask = signal<ITask>(new Task());

  protected filteredTasks = computed(() => {
    const statusFilter = this.filters.status();
    const projectFilter = this.filters.projects();
    return statusFilter.length + projectFilter.length > 0
      ? this.service.tasks().filter(m => {
        return (statusFilter.length === 0 || statusFilter.includes(m.status)) 
            && (projectFilter.length === 0 || projectFilter.includes(m.projectId ?? 'never'));
      })
      : this.service.tasks();
  })
  protected showFilterUI = signal(false);

  private filters = {
    status: signal<readonly ProjectStatus[]>([]),
    projects: signal<readonly string[]>([]),
  }
  protected filterCount = computed(() => this.filters.status().length + this.filters.projects().length);

  protected showSortUI = signal(false);
  protected currentSort = this.service.sortInfo;

  protected icons = {
    filters: faFilters,
    sort: faSort,
  }

  //methods
  protected toggleFilterUI() {
    this.showFilterUI.update(v => !v);
  }

  protected updateFilter (key: keyof typeof this.filters, value: string[]) {
    if (value.length > 0) {
      //validate type
      if (key === 'status' && arrayHelp.elementsOfType<ProjectStatus>(value, (x: unknown) => strHelp.isStringUnionType(x, projectStatusList))) {
        this.filters[key].set(value);
      }
      else if (key === 'projects') {
        this.filters[key].set(value);
      }
      else {
        throw new Error(`updateFilter() received an invalid filter array for the given key: ${key}`);
      }
    }
    else {
      //reset the filter to empty array
      this.filters[key].set([]);
    }
  }


  protected toggleSortUI() {
    this.showSortUI.update(v => !v);
  }

  protected updateSort(sort: SortInfo) {
    this.service.sort(sort);
  }


  protected updateTask (task: ITask) {
    console.log('DEBUG: updateTask (list)', task);
    if (this.service.exists(task.id)) {
      this.service.update(task.id, task);
    }
    else {
      this.service.add(task);
    }
  }


}
