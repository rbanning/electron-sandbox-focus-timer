import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask, TaskStatus, taskStatusList } from '@services/task/task.model';
import { taskStatusColorTuple } from '@components/task/task-status-color-tuple';

@Component({
  selector: 'app-task-breakdown-visual',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="font-semibold">
      {{completed()}}/{{total()}}
    </span>
    <span
      [title]="percentCompleted() + '% completed'" 
      class="relative flex-1 bg-slate-100 w-full h-2">
      @if (percentCompleted() > 0) {
        <span
          [style.width]="percentCompleted() + '%'" 
          class="absolute top-0 left-0 bottom-0 bg-green-300"></span>
      }
    </span>
  `,
  styles: ':host { display: flex; align-items: center; gap: 0.5rem; width: 100%; }'
})
export class TaskBreakdownVisualComponent {

  tasks = input.required<ITask[]>();

  //only interested in tasks that have not been completed!
  private nonCancelledTasks = computed(() => this.tasks().filter(m => m.status !== 'cancelled'));
  
  protected total = computed(() => this.nonCancelledTasks().length );
  protected completed = computed(() => this.tasks().filter(m => m.status === 'completed').length ); 
  protected percentCompleted = computed(() => {
    if (this.total() === 0) {
      return 0;
    }
    //else 
    return Math.floor(this.completed() / this.total() * 100);
  })
  protected breakdown = computed(() => {
    const total = this.total();
    if (total === 0) { return []; }
    //else

    const statusList = taskStatusList.filter(m => m !== 'cancelled');
    return statusList.map(status => {
      const count = this.tasks().filter(m => m.status === status).length;
      const percent = `${Math.floor((count/total)*100)}%`;
      return {
        status,
        count,
        percent,
        color: taskStatusColorTuple[status][1]
      };
    })
    .filter(m => m.count > 0);
  })

}
