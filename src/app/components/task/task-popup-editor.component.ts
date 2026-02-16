import { booleanAttribute, Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals'; // !! EXPERIMENTAL
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faPlusCircle, faXmark } from '@fortawesome/pro-duotone-svg-icons';

import { ITask, Task, TaskStatus, taskStatusList, TaskType, taskTypes } from '@services/task/task.model';
import { ITaskFormModel, taskFormModelSchema, toITaskFormModel, toTask } from '@services/task/task.form-model';
import { InputErrorMessageComponent } from '@components/input/input-error-message.component';
import { Action, TaskCardMenuComponent } from './task-card-menu.component';
import { exhaustiveCheck } from '@common/misc';
import { IProject } from '@services/project/project.model';
import { ProjectService } from '@services/project/project.service';

@Component({
  selector: 'app-task-popup-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, FormField, 
    InputErrorMessageComponent, TaskCardMenuComponent,
  ],
  templateUrl: './task-popup-editor.component.html',
  styleUrl: './task-popup-editor.component.css',
})
export class TaskPopupEditorComponent {

  //input
  taskOriginal = input.required<ITask>({
    alias: 'task'
  });
  isNew = input(false, { transform: booleanAttribute });
  iconSize = input<SizeProp>('1x');

  //callbacks
  save = output<ITask>();

  //writable task signal for tracking changes
  protected readonly taskModel = signal<ITaskFormModel>(toITaskFormModel(new Task())); 

  //form for binding model to input elements
  protected taskForm = form(this.taskModel, taskFormModelSchema);

  //state
  protected readonly active = signal<boolean>(false);


  //lists
  protected readonly statusOptions = signal<TaskStatus[]>([...taskStatusList]);
  protected readonly typeOptions = signal<TaskType[]>([...taskTypes]);
  protected readonly projectOptions = signal<IProject[]>([]);

  icons = {
    close: faXmark,
    new: faPlusCircle,
  }

  //project service is used to get list of projects
  private projectService = inject(ProjectService);

  constructor() {
    effect(() => {
      this.taskModel.set(toITaskFormModel(this.taskOriginal()));
      this.projectOptions.set([...this.projectService.projects()]);
    });
  }


  //methods

  btnActivate(action: Action) {
    switch(action) {
      case 'edit':
        this.toggle(true); //open editor
        break;
      case 'start':
        this._updateStatusStart();
        break;
      case 'hold':
        this._updateStatusHold();
        break;
      case 'completed':
        this._updateStatusCompleted();
        break;

      default:
        exhaustiveCheck(action);
    }
  }

  toggle(value?: boolean) {
    if (typeof(value) === 'boolean') {
      this.active.set(value);
    }
    else {
      this.active.update(v => !v);
    }
  }

  saveEdits() {
    const task = toTask(this.taskModel());
    console.log('DEBUG: saveEdits (editor)', {model: this.taskModel(), task});
    this.save.emit(task);
    this.taskForm().reset(); //reset the form's state
    this.toggle(false); //close editor
  }
  
  cancelEdits() {
    this.taskModel.set(toITaskFormModel(this.taskOriginal())); //reset - clear any edits
    this.taskForm().reset(); //reset the form's state
    this.toggle(false); //close editor
  }

  //private (helper) methods

  _updateStatusStart() {
    //validate
    const status = this.taskModel().status;
    if (status !== 'active') {
      this.taskModel.update(v => ({...v, status: 'active'}));
      this.saveEdits();
    }
    else {
      console.warn("TaskPopupEditor - update status error", {status: { current: status, target: 'active' }, error: 'invalid current status'});
    }
  }

  _updateStatusHold() {
    //validate
    const status = this.taskModel().status;
    if (status !== 'cancelled') {
      this.taskModel.update(v => ({...v, status: 'hold'}));
      this.saveEdits();
    }
    else {
      console.warn("TaskPopupEditor - update status error", {status: { current: status, target: 'hold' }, error: 'invalid current status'});
    }
  }

  _updateStatusCompleted() {
    //validate
    const status = this.taskModel().status;
    if (status !== 'cancelled') {
      this.taskModel.update(v => ({...v, status: 'completed'}));
      this.saveEdits();
    }
    else {
      console.warn("TaskPopupEditor - update status error", {status: { current: status, target: 'completed' }, error: 'invalid current status'});
    }
  }


}
