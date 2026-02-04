import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from '@components/project/project-list.component';
import { ProjectService } from '@services/project/project.service';
import { mockProjectRepo } from '@services/project/project-mock-repo';
import { arrayHelp } from '@common/general';


@Component({
  selector: 'app-test-view',
  standalone: true,
  imports: [CommonModule, ProjectListComponent],
  templateUrl: './test-view.component.html',
  styles: ':host { display: block; }'
})
export class TestViewComponent {
  title = signal("Testing...");

  subtitle = signal("Github Integration");

  private service = inject(ProjectService);

  protected seed(count?: number) {
    this.service.seed(arrayHelp.take(mockProjectRepo(), count ?? 1000));
  }
}

