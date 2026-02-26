import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '@services/task/task.service';
import { IProject } from '@services/project/project.model';
import { ITask } from '@services/task/task.model';
import { primitive, strHelp } from '@common/general';
import { TaskBreakdownVisualComponent } from './task-breakdown-visual.component';


type ProjectTask = {
  project?: IProject,
  tasks: ITask[];
}

@Component({
  selector: 'app-project-task-dashboard',
  standalone: true,
  imports: [CommonModule,
    TaskBreakdownVisualComponent
  ],
  templateUrl: './project-task-dashboard.component.html',
  styles: ':host { display: block; }'
})
export class ProjectTaskDashboardComponent {

  //computed
  protected data = computed(() => {
    const result = this.taskService.tasks().reduce((ret: ProjectTask[], task) => {
      const found = (task.projectId && task.project)
        ? ret.find(m => m.project?.id === task.projectId)
        : ret.find(m => primitive.isNullish(m.project));
      if (found) {
        found.tasks.push(task);
      }
      else {
        ret.push({
          project: task.project ?? undefined,
          tasks: [task]
        });
      }

      return ret;
    }, []);

    result.sort((a, b) => {
      if (a.project && b.project) {
        return strHelp.compare(a.project.name, b.project.name);
      }
      //else
      return a.project
        ? 1
        : b.project
          ? -1
          : 0;
    });

    return result;
  })

  //services
  private taskService = inject(TaskService);

}
