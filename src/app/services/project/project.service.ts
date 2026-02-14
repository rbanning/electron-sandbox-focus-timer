import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '@services/storage/storage.service';
import { IProject, Project } from './project.model';
import { dayjsHelp, objHelp, primitive, strHelp } from '@common/general';


export type SortDirection = 'asc' | 'desc';
export type SortInfo = { key: keyof IProject, direction: SortDirection };
export const defaultSortInfo: SortInfo = { key: 'name', direction: 'asc' };

type SortComparer = (a: IProject, b: IProject) => number;


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly KEY = 'hallpass-projects';
  private readonly KEY_SORT = 'hallpass-projects-sort';

  //private props
  private readonly _projects = signal<ReadonlyArray<IProject>>([]);
  private readonly _sortInfo = signal<SortInfo>(defaultSortInfo);

  private storage = inject(StorageService);

  //public props
  public readonly projects = computed(() => this._projects());
  public readonly sortInfo = computed(() => this._sortInfo());

  constructor() {
    this._init();
  }


  //public methods

  exists(projectId: string) {
    return this._projects().some(m => m.id === projectId);
  }

  get(projectId: string) {
    return this._projects().find(m => m.id === projectId);
  }

  add(project: IProject) {
    this._projects.update(items => [...items, project]);
    this._save();
    console.log("DEBUG: add project (service)", {id: project.id, projects: this._projects()})
  }

  update(projectId: string, changes: Partial<IProject>) {
    changes.lastUpdated = dayjsHelp.now(); //update the last update timestamp
    this._projects.update(items => items.map(item => {
      if (item.id === projectId) {
        return {...item, ...changes};
      }
      //else
      return item;
    }));
    this._save();
    console.log("DEBUG: update project (service)", {id: projectId, changes, projects: this._projects()});
  }


  remove(project: IProject): boolean;
  remove(projectId: string): boolean;
  remove(arg: IProject | string): boolean {
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


  seed(projects: IProject[]) {
    this._projects.set(projects);
    this._save();
  }

  sort(info: SortInfo): void;
  sort(key: keyof IProject): void;
  sort(key: keyof IProject, direction: SortDirection): void;
  sort(arg1: (keyof IProject) | SortInfo, arg2?: SortDirection) {
    const key = primitive.isString(arg1)
      ? arg1
      : arg1.key;
    const direction = arg2 ?? 
      (primitive.isObject(arg1) 
        ? arg1.direction 
        : defaultSortInfo.direction
      );
    const projects = [...this.projects()];
    const comparer = this._comparer(key, direction);
    projects.sort(comparer);
    this._projects.set(projects);
    this._sortInfo.set({key, direction});
    this._save();
  }

  //private (helper) methods

  private _init() {
    //initialize the list of projects
    let projects: IProject[] = []; //default to an empty list;
    const result = this.storage.get<IProject[]>(this.KEY);
    if (Array.isArray(result) && result.length > 0) {
      //validate integrity of the array by examining the first project
      if (Project.isProject(result[0])) {
        projects = result.map(m => new Project(m));
      }
    }
    this._projects.set(projects);

    //get the saved sort info
    const sortInfo = this.storage.get<SortInfo>(this.KEY_SORT);
    if (objHelp.hasKeys<SortInfo>(sortInfo, ['key', 'direction'])) {
      this._sortInfo.set(sortInfo);
    }
  }

  private _save() {
    this.storage.set(this.KEY, this._projects());
    this.storage.set(this.KEY_SORT, this._sortInfo());
  }
  
  private _comparer(key: keyof IProject, direction: SortDirection): SortComparer {
    //default to a string comparison
    let comparer: SortComparer = (a,b) => {
      return direction === 'asc'
        ? strHelp.compare(a[key], b[key])
        : strHelp.compare(b[key], a[key]);
    };

    if (key === 'startDate' || key === 'lastUpdated') {
      comparer = (a,b) => {
        return direction === 'asc'
          ? dayjsHelp.compare(a[key], b[key])
          : dayjsHelp.compare(b[key], a[key]);
      }
    }

    return comparer;
  }
}