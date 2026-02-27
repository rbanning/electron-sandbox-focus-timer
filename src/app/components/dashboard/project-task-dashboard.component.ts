import { booleanAttribute, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '@services/task/task.service';
import { IProject } from '@services/project/project.model';
import { ITask } from '@services/task/task.model';
import { dayjsHelp, primitive, strHelp } from '@common/general';
import { TaskBreakdownVisualComponent } from './task-breakdown-visual.component';
import { TaskStatusBoxComponent } from '@components/task/task-status-box.component';
import { WeekFlowComponent } from '@components/general/week-flow.component';


type ProjectTask = {
  project?: IProject,
  tasks: ITask[];
}

@Component({
  selector: 'app-project-task-dashboard',
  standalone: true,
  imports: [CommonModule,
    TaskBreakdownVisualComponent,
    TaskStatusBoxComponent,
    WeekFlowComponent
  ],
  templateUrl: './project-task-dashboard.component.html',
  styles: ':host { display: block; }'
})
export class ProjectTaskDashboardComponent {

  //input
  inclCancelled = input(false, { transform: booleanAttribute });
  
  //computed
  protected data = computed(() => {
    const tasks = this.taskService.tasks()
              .filter(m => this.inclCancelled() || m.status !== 'cancelled');

    const result = tasks.reduce((ret: ProjectTask[], task) => {
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
  });

  protected startWeekFlowDate = computed(() => {
    //the start of the week flow is three weeks from today on a Monday
    //  ending with the current week
    const start = dayjsHelp.now().add(-2, 'week');
    return dayjsHelp.moveToClosest('Monday', start) ?? start;  //force to a DayJs
  })
  protected weekHeadings = computed(() => {
    //three headings in the form "Week of MMM-DD"
    //  ending with the current week
    return [
      this.startWeekFlowDate().format("MMM-DD"),
      this.startWeekFlowDate().add(1, 'week').format("MMM-DD"),
      this.startWeekFlowDate().add(2, 'week').format("MMM-DD"),
    ];
  })

  //services
  private taskService = inject(TaskService);

}
