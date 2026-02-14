import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProject, Project } from '@services/project/project.model';
import { projectStatusColorTuple } from './project-status-color-tuple';

@Component({
  selector: 'app-project-mini-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isValid()) {
      <span class="w-2 h-2" [style.backgroundColor]="color()">
        <span class="sr-only">status: {{project().status}}</span>
      </span>
      <span class="text-slate-600 font-semibold">{{project().name}}</span>
    }
  `,
  styles: ':host { display: inline-flex; align-items: center; gap: 0.5rem; }'
})
export class ProjectMiniCardComponent {

  project = input.required<IProject>();
  protected isValid = computed(() => Project.isProject(this.project()));
  protected color = computed(() => projectStatusColorTuple[this.project().status][1]);  //get the secondary color

}
