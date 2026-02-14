import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from '@components/project/project-list.component';
import { GridListFormat, gridListFormats } from '@components/common/format-grid-list.type';

@Component({
  selector: 'app-projects-view',
  standalone: true,
  imports: [CommonModule, ProjectListComponent],
  templateUrl: './project-view.component.html',
  styles: ':host { display: block; }'
})
export class ProjectsViewComponent {

  protected view = signal<GridListFormat>(gridListFormats[0]);

  protected views = [...gridListFormats];


}
