import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask, TaskStatus, taskStatusList } from '@services/task/task.model';
import { taskStatusColorTuple } from '@components/task/task-status-color-tuple';

@Component({
  selector: 'app-task-breakdown-visual',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (item of counts(); track item) {
      <span
        [title]="item.count + ' ' + item.status"
        [attr.data-percent]="item.percent" 
        class="inline-block h-4 min-w-2 rounded-e-lg"
        [style.backgroundColor]="item.color"
        [style.width]="item.percent"
        ></span>
    }
  `,
  styles: ':host { display: block; width: 100%; }'
})
export class TaskBreakdownVisualComponent {

  tasks = input.required<ITask[]>();

  protected counts = computed(() => {
    const total = this.tasks().length;
    if (total === 0) { return []; }
    //else
    const statusList = this.tasks().map(m => m.status);
    return taskStatusList
      .filter(m => statusList.includes(m))
      .reduce((ret, status) => {
      const count = this.tasks().filter(m => m.status === status).length;
      const percent = `${Math.floor((count/total)*100)}%`;
        
      ret.push({
        status,
        count,
        percent,
        color: taskStatusColorTuple[status][1]
      });
      return ret;
    }, [] as { status: TaskStatus, count: number, percent: string, color: string }[]);
  })

}
