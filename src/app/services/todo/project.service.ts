import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '@services/storage/storage.service';
import { IProject, Project } from './project.model';
import { primitive } from '@common/general';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly KEY = 'hallpass-projects';

  //private props
  private readonly _projects = signal<ReadonlyArray<IProject>>([]);

  private storage = inject(StorageService);

  //public props
  public readonly projects = computed(() => this._projects());
  

  constructor() {
    this._init();
  }


  //public methods

  addProject(project: IProject) {
    this._projects.update(items => [...items, project]);
    this._save();
  }

  updateProject(projectId: string, changes: Partial<IProject>) {
    this._projects.update(items => items.map(item => {
      if (item.id === projectId) {
        return {...item, ...changes};
      }
      //else
      return item;
    }))
  }

  removeProject(project: IProject): boolean;
  removeProject(projectId: string): boolean;
  removeProject(arg: IProject | string): boolean {
    const id = Project.isProject(arg)
      ? arg.id
      : primitive.isString(arg)
        ? arg
        : null;
    if (!id) {
      throw new Error("ProjectService cannot remove project - missing project id");
    }
    const found = Boolean(this._projects().find(m => m.id === id));
    if (!found) {
      return false;
    }

    //else remove from array and save
    this._projects.update(items => items.filter(m => m.id === id));
    this._save();
    return true;
  }




  //private (helper) methods

  private _init() {
    //initialize the list of projects
    const result = this.storage.get<IProject[]>(this.KEY);
    if (Array.isArray(result) && result.length > 0) {
      //validate integrity of the array by examining the first project
      if (Project.isProject(result[0])) {
        this._projects.set(result);
      }
    }
    else {
      this._projects.set([]);  //default - empty array
    }
  }

  private _save() {
    this.storage.set(this.KEY, this._projects());
  }
  
}