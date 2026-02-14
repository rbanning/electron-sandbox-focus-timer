import { booleanAttribute, Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals'; // !! EXPERIMENTAL
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faPlusCircle, faXmark } from '@fortawesome/pro-duotone-svg-icons';

import { IProject, Project, projectStatusList, projectTypeList } from '@services/project/project.model';
import { IProjectFormModel, projectFormModelSchema, toIProjectFormModel } from '@services/project/project.form-model';
import { InputErrorMessageComponent } from '@components/input/input-error-message.component';
import { Action, ProjectCardMenuComponent } from './project-card-menu.component';
import { exhaustiveCheck } from '@common/misc';
import { dayjsHelp } from '@common/general';

@Component({
  selector: 'app-project-popup-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, FormField, 
    InputErrorMessageComponent, ProjectCardMenuComponent],
  templateUrl: './project-popup-editor.component.html',
  styleUrl: './project-popup-editor.component.css',
})
export class ProjectPopupEditorComponent {

  //input
  projectOriginal = input.required<IProject>({
    alias: 'project'
  });
  isNew = input(false, { transform: booleanAttribute });
  iconSize = input<SizeProp>('1x');

  //callbacks
  save = output<IProject>();

  //writable person signal for tracking changes
  protected readonly projectModel = signal<IProjectFormModel>(toIProjectFormModel(new Project())); 

  //form for binding model to input elements
  protected projectForm = form(this.projectModel, projectFormModelSchema);

  //state
  protected readonly active = signal<boolean>(false);


  //lists
  protected readonly statusOptions = projectStatusList;
  protected readonly typeOptions = projectTypeList;

  icons = {
    close: faXmark,
    new: faPlusCircle,
  }

  constructor() {
    effect(() => {
      this.projectModel.set(toIProjectFormModel(this.projectOriginal()));
    })
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
    console.log('DEBUG: saveEdits (editor)', this.projectModel());
    this.save.emit(new Project(this.projectModel()));
    this.projectForm().reset(); //reset the form's state
    this.toggle(false); //close editor
  }
  
  cancelEdits() {
    this.projectModel.set(toIProjectFormModel(this.projectOriginal())); //reset - clear any edits
    this.projectForm().reset(); //reset the form's state
    this.toggle(false); //close editor
  }

  //private (helper) methods

  _updateStatusStart() {
    //validate
    const status = this.projectModel().status;
    if (status !== 'active') {
      //only update the startDate if it is empty
      const startDate = this.projectModel().startDate || dayjsHelp.format.asInput(dayjsHelp.now());
      this.projectModel.update(v => ({...v, status: 'active', startDate}));
      this.saveEdits();
    }
    else {
      console.warn("ProjectPopupEditor - update status error", {status: { current: status, target: 'active' }, error: 'invalid current status'});
    }
  }

  _updateStatusHold() {
    //validate
    const status = this.projectModel().status;
    if (status === 'active') {
      //only update the startDate if it is empty
      const startDate = this.projectModel().startDate || dayjsHelp.format.asInput(dayjsHelp.now());
      this.projectModel.update(v => ({...v, status: 'hold', startDate}));
      this.saveEdits();
    }
    else {
      console.warn("ProjectPopupEditor - update status error", {status: { current: status, target: 'hold' }, error: 'invalid current status'});
    }
  }

  _updateStatusCompleted() {
    //validate
    const status = this.projectModel().status;
    if (status === 'active' || status === 'hold') {
      //only update the startDate if it is empty
      const startDate = this.projectModel().startDate || dayjsHelp.format.asInput(dayjsHelp.now());
      this.projectModel.update(v => ({...v, status: 'completed', startDate}));
      this.saveEdits();
    }
    else {
      console.warn("ProjectPopupEditor - update status error", {status: { current: status, target: 'completed' }, error: 'invalid current status'});
    }
  }


}
