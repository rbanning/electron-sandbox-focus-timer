import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '@components/task/task-list.component';
import { TaskService } from '@services/task/task.service';
import { mockTaskRepo } from '@services/task/task-mock-repo';
import { arrayHelp } from '@common/general';


@Component({
  selector: 'app-test-view-tasks',
  standalone: true,
  imports: [CommonModule, TaskListComponent ],
  templateUrl: './test-view-tasks.component.html',
  styles: ':host { display: block; }'
})
export class TestViewTasksComponent {
  private service = inject(TaskService);

  protected seed(count?: number) {
    this.service.seed(arrayHelp.take(mockTaskRepo(), count ?? 1000));
  }
}

