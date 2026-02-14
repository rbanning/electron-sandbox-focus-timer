import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestViewProjectsComponent } from './test-view-projects.component';
import { TestViewTasksComponent } from './test-view-tasks.component';
import { TestViewKanbanComponent } from './test-view-kanban.component';

const viewList = ['Tasks', 'Kanban', 'Projects'] as const;
type TestView = typeof viewList[number];
@Component({
  selector: 'app-test-view',
  standalone: true,
  imports: [CommonModule, 
    TestViewProjectsComponent, 
    TestViewTasksComponent,
    TestViewKanbanComponent 
  ],
  templateUrl: './test-view.component.html',
  styles: ':host { display: block; }'
})
export class TestViewComponent {
  title = signal("Testing...");

  subtitle = signal("Tasks | Projects");

  protected view = signal<TestView>(viewList[0]);

  protected views = [...viewList];
}

