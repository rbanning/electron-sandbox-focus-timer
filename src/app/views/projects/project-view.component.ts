import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from '@components/project/project-list.component';

@Component({
  selector: 'app-projects-view',
  standalone: true,
  imports: [CommonModule, ProjectListComponent],
  template: `
<div class="view-area">
  <app-project-list />
</div>
  `,
  styles: ':host { display: block; }'
})
export class ProjectsViewComponent {

  

}
