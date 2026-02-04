import { booleanAttribute, Component, computed, effect, EventEmitter, input, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faPencilAlt, faPlusCircle, faXmark } from '@fortawesome/pro-duotone-svg-icons';

import { dayjsHelp, objHelp } from '@common/general';
import { IProject, Project, projectStatusList, projectTypeList } from '@services/project/project.model';

@Component({
  selector: 'app-project-popup-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
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
  protected readonly project = signal<IProject>(new Project()); 
  protected readonly hasChanged = computed(() => !objHelp.deepEqual(this.projectOriginal(), this.project()))
  protected readonly startDate = computed(() => dayjsHelp.format.asInput(this.project().startDate)); //used to bind to input

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
      this.project.set(new Project(this.projectOriginal()));
    })
  }


  //methods

  toggle() {
    this.active.update(v => !v);
  }

  updateProject(key: keyof IProject, value: unknown) {  
    this.project.update(current => new Project({
      ...current,
      [key]: value,
      lastUpdated: dayjsHelp.now(), //update on any edit
    }));
  }

  saveEdits() {
    console.log('DEBUG: saveEdits (editor)', this.project());
    this.save.emit(this.project());
    this.toggle();
  }
  
  cancelEdits() {
    this.project.set(new Project(this.projectOriginal()));
    this.toggle();
  }
}
