import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from '@common/types';
import { IProject, Project } from './../../services/todo/project.model';
import { ProjectStatusComponent } from './project-status.component';
import { ProjectTypeComponent } from './project-type.component';
import { ProjectDateComponent } from './project-date.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, ProjectStatusComponent, ProjectTypeComponent, ProjectDateComponent],
  template: `
    @if (isValid()) {
    <div class="p-2 border border-slate-300 bg-slate-50 rounded-md shadow-md" [attr.data-id]="project()?.id">
      <div class="flex items-center gap-1">
        <div class="flex-1 font-semibold text-lg text-slate-700">{{project()?.name}}</div>
        <app-project-status [status]="project()?.status ?? 'pending'" />
        <app-project-type [type]="project()?.type ?? 'other'" />
      </div>
      <div class="flex gap-2 text-slate-400">
        <span class="">{{project()?.client}}</span>
      </div>
      <div class="-space-y-1">
        <app-project-date [date]="project()?.startDate" type="start" />
        <app-project-date [date]="project()?.lastUpdated" type="updated" />
      </div>
    </div>
    }
  `,
  styles: ':host { display: block; }'
})
export class ProjectCardComponent {

  project = input<Nullable<IProject>>();  
  isValid = computed(() => Project.isProject(this.project()));
}
