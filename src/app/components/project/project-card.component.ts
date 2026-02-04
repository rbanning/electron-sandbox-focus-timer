import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProject, Project } from '../../services/project/project.model';
import { ProjectStatusComponent } from './project-status.component';
import { ProjectTypeComponent } from './project-type.component';
import { ProjectDateComponent } from './project-date.component';
import { ProjectPopupEditorComponent } from './project-popup-editor.component';
import { ProjectStatusHorizontalBorderComponent } from './project-status-horizontal-border.component';
import { ProjectTypeVerticalBorderComponent } from './project-type-vertical-border.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, 
    ProjectStatusComponent, ProjectStatusHorizontalBorderComponent, 
    ProjectTypeComponent, ProjectTypeVerticalBorderComponent,
    ProjectDateComponent, ProjectPopupEditorComponent],
  template: `
    @if (isValid()) {
    <div class="group relative p-2 pl-4 pb-4 border border-slate-300 bg-slate-50 rounded-md shadow-md overflow-hidden" [attr.data-id]="project().id">      
      <div class="flex items-center gap-1">
        <div class="flex-1 font-semibold text-lg text-slate-700">{{project().name}}</div>
        <app-project-status [status]="project().status" />
        <app-project-type [type]="project().type" />
        @if (!readonly()) {
          <app-project-popup-editor [project]="project()" (save)="saveEdits($event)" />
        }
      </div>
      <div class="flex gap-2 text-slate-400">
        <span class="">{{project().client}}</span>
      </div>
      <div class="-space-y-1">
        <app-project-date [date]="project().startDate" type="start" />
        <app-project-date [date]="project().lastUpdated" type="updated" />
      </div>
      <app-project-status-horizontal-border [status]="project().status" />
      <app-project-type-vertical-border [type]="project().type" />
    </div>
    }
  `,
  styles: `
    :host { 
      display: block; 
    }
  `
})
export class ProjectCardComponent {

  project = input.required<IProject>(); 
  readonly = input(false);
  save = output<IProject>();

  protected isValid = computed(() => Project.isProject(this.project()));

  saveEdits (project: IProject) {
    console.log('DEBUG: change (card)', project);    
    this.save.emit(project); //pass to parent;
  }
}
