import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '@services/task/task.service';
import { mockTaskRepo } from '@services/task/task-mock-repo';
import { arrayHelp } from '@common/general';
import { TaskKanbanComponent } from '@components/task/task-kanban.component';


@Component({
  selector: 'app-test-view-kanban',
  standalone: true,
  imports: [CommonModule, TaskKanbanComponent ],
  templateUrl: './test-view-kanban.component.html',
  styles: ':host { display: block; }'
})
export class TestViewKanbanComponent {
  private service = inject(TaskService);

  protected seed(count?: number) {
    this.service.seed(arrayHelp.take(mockTaskRepo(), count ?? 1000));
  }
}

