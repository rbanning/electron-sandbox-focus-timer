import { castAs } from '@common/types';
import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilters } from '@fortawesome/pro-duotone-svg-icons';

import { arrayHelp, strHelp } from '@common/general';
import { IProject, ProjectStatus, projectStatusList, ProjectType, projectTypeList } from '@services/todo/project.model';
import { ProjectListFilterStatusComponent } from './project-list-filter-status.component';
import { ProjectCardComponent } from './project-cart.component';
import { ProjectListFilterTypeComponent } from './project-list-filter-type.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, 
    ProjectListFilterStatusComponent, ProjectListFilterTypeComponent,
    ProjectCardComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {

  projects = input<readonly IProject[]>([]);
  protected filteredProjects = computed(() => {
    const statusFilter = this.filters.status();
    const typeFilter = this.filters.type();
    return statusFilter.length + typeFilter.length > 0
      ? this.projects().filter(m => {
        return (statusFilter.length === 0 || statusFilter.includes(m.status)) 
            && (typeFilter.length === 0 || typeFilter.includes(m.type));
      })
      : this.projects();
  })
  protected showFilterUI = signal(false);

  private filters = {
    status: signal<readonly ProjectStatus[]>([]),
    type: signal<readonly ProjectType[]>([]),
  }
  protected filterCount = computed(() => this.filters.status().length + this.filters.type().length);

  icons = {
    filters: faFilters 
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
}
