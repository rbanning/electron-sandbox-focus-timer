import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProjectStatus } from '@services/project/project.model';
import { projectStatusColorTuple } from './project-status-color-tuple';

@Component({
  selector: 'app-project-status-horizontal-border',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div
      [title]="status()" 
      class="absolute bottom-0 left-0 w-full h-2 opacity-80 group-hover:opacity-100 transition-opacity duration-1000 z-2"
      [style.backgroundColor]="color()"
    >
      <span class="sr-only">{{status()}}</span>
    </div>
  `,
  styles: ':host { display: block; }'
})
export class ProjectStatusHorizontalBorderComponent {

  status = input.required<ProjectStatus>();
  protected color = computed(() => projectStatusColorTuple[this.status()][1]);  //get the secondary color
}
