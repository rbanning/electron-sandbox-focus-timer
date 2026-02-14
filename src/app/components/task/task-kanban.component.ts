import { booleanAttribute, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faFilters, faSort } from '@fortawesome/pro-duotone-svg-icons';
import { arrayHelp, strHelp } from '@common/general';
import { SortInfo, TaskService } from '@services/task/task.service';
import { ProjectStatus, projectStatusList } from '@services/project/project.model';
import { ITask, Task, TaskStatus, taskStatusList } from '@services/task/task.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TaskListFilterStatusComponent } from './task-list-filter-status.component';
import { TaskListFilterProjectComponent } from './task-list-filter-project.component';
import { TaskListSortSelectorComponent } from './task-list-sort-selector.component';
import { TaskCardComponent } from './task-card.component';
import { TaskKanbanColHeadingComponent } from './task-kanban-col-heading.component';
import { TaskPopupEditorComponent } from './task-popup-editor.component';

type TaskDictionary = {[key in TaskStatus]?: ITask[]}

@Component({
  selector: 'app-task-kanban',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,
    TaskListFilterStatusComponent, TaskListFilterProjectComponent,
    TaskListSortSelectorComponent, TaskKanbanColHeadingComponent,
    TaskCardComponent, TaskPopupEditorComponent
  ],
  templateUrl: './task-kanban.component.html',
  styles: `:host { display: block; }`,
})
export class TaskKanbanComponent {

  //task service
  private service = inject(TaskService);

  //input
  readonly = input(false, { transform: booleanAttribute });
  allowNew = input(true, { transform: booleanAttribute });

  protected newTask = signal<ITask>(new Task());

  protected statusList = computed(() => {
    const statusFilter = this.filters.status();
    return statusFilter.length === 0
      ? taskStatusList
      : statusFilter;
  });

  protected filteredTasks = computed(() => {
    const projectFilter = this.filters.projects();

    const tasks = this.service.tasks();

    return this.statusList().reduce((dict: TaskDictionary, status) => {
      dict[status] = tasks.filter(m => m.status === status && (projectFilter.length === 0 || projectFilter.includes(m.projectId ?? 'never')));
      return dict;
    }, {});
  })
  protected showFilterUI = signal(false);

  private filters = {
    status: signal<readonly ProjectStatus[]>(taskStatusList.filter(m => m !== 'cancelled' && m !== 'completed')), //initialized to standard filter
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
