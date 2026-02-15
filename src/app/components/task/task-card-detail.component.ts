import { booleanAttribute, Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask, Task, TaskStatus, taskStatusList, TaskType, taskTypes } from '@services/task/task.model';
import { faXmark, faPlusCircle } from '@fortawesome/pro-duotone-svg-icons';
import { IProject } from '@services/project/project.model';
import { ProjectService } from '@services/project/project.service';
import { ITaskFormModel, toITaskFormModel, taskFormModelSchema, toTask } from '@services/task/task.form-model';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormField, form } from '@angular/forms/signals'; // !! EXPERIMENTAL
import { InputErrorMessageComponent } from '@components/input/input-error-message.component';
import { Nullable } from '@common/types';


@Component({
  selector: 'app-task-card-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, FormField,
    InputErrorMessageComponent
  ],
  templateUrl: './task-card-detail.component.html',
  styleUrls: ['./task-card-detail.component.css']
})
export class TaskCardDetailComponent {

  //input
  taskOriginal = input<Nullable<ITask>>(null, { alias: 'task' });
  readonly = input(false, { transform: booleanAttribute });
  
  //callbacks
  save = output<ITask>();  //notify parent of user action - save
  cancel = output();       //notify parent of user action - cancel

  //writable task signal for tracking changes
  protected readonly taskModel = signal<ITaskFormModel>(toITaskFormModel(new Task())); 

  //form for binding model to input elements 
  protected taskForm = form(this.taskModel, taskFormModelSchema);

  //lists
  protected readonly statusOptions = signal<TaskStatus[]>([...taskStatusList]);
  protected readonly typeOptions = signal<TaskType[]>([...taskTypes]);
  protected readonly projectOptions = signal<IProject[]>([]);

  icons = {
    close: faXmark,
    new: faPlusCircle,
  }

  //DI  
  private projectService = inject(ProjectService); // used to get list of projects

  constructor() {
    effect(() => {
      this.taskModel.set(toITaskFormModel(this.taskOriginal() ?? new Task()));
      this.projectOptions.set([...this.projectService.projects()]);
    });
  }

  
    //methods
  
    quickStatus(status: TaskStatus) {
      //only update if needed
      const current = this.taskModel().status;
      if (current !== status) {
        this.taskModel.update(v => ({...v, status: 'active'}));
        this.saveEdits();
      }
      else {
        console.warn("TaskPopupEditor - update status error", {status: { current: status, target: 'active' }, error: 'invalid current status'});
      }
    }

  
    saveEdits() {
      const task = toTask(this.taskModel()); //parses model -> task
      this.taskForm().reset(); //reset the form's state
      console.log('DEBUG: saveEdits (editor)', task);
      this.save.emit(task);
    }
    
    cancelEdits() {
      this.taskModel.set(toITaskFormModel(this.taskOriginal() ?? new Task())); //reset - clear any edits
      this.taskForm().reset(); //reset the form's state
      this.cancel.emit();
    }
  
    //private (helper) methods
    
}
