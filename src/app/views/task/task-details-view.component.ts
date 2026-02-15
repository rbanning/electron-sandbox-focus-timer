import { Component, computed, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '@services/task/task.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ITask } from '@services/task/task.model';
import { TaskCardDetailComponent } from '@components/task/task-card-detail.component';
import { Nullable } from '@common/types';
import { faCircleChevronLeft } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-details-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, 
    TaskCardDetailComponent
  ],
  templateUrl: './task-details-view.component.html',
  styles: ':host { display: block; }'
})
export class TaskDetailsViewComponent {

  //input (bound to route param 'id')
  id = input.required<string>();

  //DI
  private taskService = inject(TaskService);
  private router = inject(Router);

  //signal
  protected task = computed<Nullable<ITask>>(() => {
    return this.taskService.get(this.id());
  });

  protected icons = {
    back: faCircleChevronLeft
  }
  
  //save() = update task and exit
  protected save(task: ITask) {
    console.log("TODO: implement save()", {task});
    //TODO: add toast
    this.exit();
  }

  //cancel() = exit
  protected cancel() {
    this.exit();
  }


  private exit() {
    this.router.navigate(['/tasks'])
  }
}
