import { booleanAttribute, Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals'; // !! EXPERIMENTAL
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faPencilAlt, faPlusCircle, faXmark } from '@fortawesome/pro-duotone-svg-icons';

import { IProject, Project, projectStatusList, projectTypeList } from '@services/project/project.model';
import { IProjectFormModel, projectFormModelSchema, toIProjectFormModel } from '@services/project/project.form-model';
import { InputErrorMessageComponent } from '@components/input/input-error-message.component';

@Component({
  selector: 'app-project-popup-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, FormField, InputErrorMessageComponent],
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
    editor: faPencilAlt,
    new: faPlusCircle,
  }

  constructor() {
    effect(() => {
      this.projectModel.set(toIProjectFormModel(this.projectOriginal()));
    })
  }


  //methods

  toggle() {
    this.active.update(v => !v);
  }

  saveEdits() {
    console.log('DEBUG: saveEdits (editor)', this.projectModel());
    this.save.emit(new Project(this.projectModel()));
    this.projectForm().reset(); //reset the form's state
    this.toggle();
  }
  
  cancelEdits() {
    this.projectModel.set(toIProjectFormModel(this.projectOriginal())); //reset - clear any edits
    this.projectForm().reset(); //reset the form's state
    this.toggle();
  }
}
