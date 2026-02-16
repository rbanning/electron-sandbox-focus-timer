import { booleanAttribute, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilters, faSort } from '@fortawesome/pro-duotone-svg-icons';

import { arrayHelp, strHelp } from '@common/general';
import { IProject, Project, ProjectStatus, projectStatusList, ProjectType, projectTypeList } from '@services/project/project.model';
import { ProjectService, SortInfo } from '@services/project/project.service';
import { ProjectListFilterStatusComponent } from './project-list-filter-status.component';
import { ProjectCardComponent } from './project-card.component';
import { ProjectListFilterTypeComponent } from './project-list-filter-type.component';
import { ProjectPopupEditorComponent } from './project-popup-editor.component';
import { ProjectListSortSelectorComponent } from './project-list-sort-selector.component';
import { GridListFormat } from '@components/common/format-grid-list.type';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, 
    ProjectListFilterStatusComponent, ProjectListFilterTypeComponent, 
    ProjectListSortSelectorComponent,
    ProjectCardComponent, ProjectPopupEditorComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['../common/format-grid-list.css'],
})
export class ProjectListComponent {

  //project service
  private service = inject(ProjectService);

  //input
  format = input<GridListFormat>('Grid');
  readonly = input(false, { transform: booleanAttribute });
  allowNew = input(true, { transform: booleanAttribute });

  protected newProject = signal<IProject>(new Project());

  protected filteredProjects = computed(() => {
    const statusFilter = this.filters.status();
    const typeFilter = this.filters.type();
    return statusFilter.length + typeFilter.length > 0
      ? this.service.projects().filter(m => {
        return (statusFilter.length === 0 || statusFilter.includes(m.status)) 
            && (typeFilter.length === 0 || typeFilter.includes(m.type));
      })
      : this.service.projects();
  })
  protected showFilterUI = signal(false);

  private filters = {
    status: signal<readonly ProjectStatus[]>([]),
    type: signal<readonly ProjectType[]>([]),
  }
  protected filterCount = computed(() => this.filters.status().length + this.filters.type().length);

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

  protected updateFilter (key: keyof typeof this.filters, value: ProjectStatus[] | ProjectType[]) {
    if (value.length > 0) {
      //validate type
      if (key === 'status' && arrayHelp.elementsOfType<ProjectStatus>(value, (x: unknown) => strHelp.isStringUnionType(x, projectStatusList))) {
        this.filters[key].set(value);
      }
      else if (key === 'type' && arrayHelp.elementsOfType<ProjectType>(value, (x: unknown) => strHelp.isStringUnionType(x, projectTypeList))) {
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


  protected updateProject (project: IProject) {
    const existing = this.service.get(project.id);
    if (existing) {
      const changes = Project.changes(existing, project);
      this.service.update(project.id, changes);
      //todo: add toast;
    }
    else {
      this.service.add(project);
      //todo: add toast;
    }
  }
}
