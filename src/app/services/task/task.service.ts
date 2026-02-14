import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '@services/storage/storage.service';
import { ITask } from './task.model';
import { dayjsHelp, primitive, objHelp, strHelp, arrayHelp } from '@common/general';
import { Task } from '@services/task/task.model';
import { ProjectService } from '@services/project/project.service';


export type SortDirection = 'asc' | 'desc';
export type SortInfo = { key: keyof ITask, direction: SortDirection };
export const defaultSortInfo: SortInfo = { key: 'name', direction: 'asc' };

type SortComparer = (a: ITask, b: ITask) => number;

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly KEY = 'hallpass-tasks';
  private readonly KEY_SORT = 'hallpass-tasks-sort';

  //private props
  private readonly _tasks = signal<ReadonlyArray<ITask>>([]);
  private readonly _sortInfo = signal<SortInfo>(defaultSortInfo);

  //DI
  private storage = inject(StorageService);
  private projectService = inject(ProjectService);

  //public props
  public readonly tasks = computed(() => this._tasks());
  public readonly sortInfo = computed(() => this._sortInfo());

  constructor() {
    this._init();
  }


  //public methods

  exists(taskId: string) {
    return this._tasks().some(m => m.id === taskId);
  }

  get(taskId: string) {
    return this._tasks().find(m => m.id === taskId);
  }

  add(task: ITask) {
    this._tasks.update(items => [...items, this._newTask(task)]);
    this._save();
    console.log("DEBUG: add task (service)", {id: task.id, tasks: this._tasks()})
  }

  update(taskId: string, changes: Partial<ITask>) {
    changes.lastUpdated = dayjsHelp.now(); //update the last update timestamp
    this._tasks.update(items => items.map(item => {
      if (item.id === taskId) {
        return this._newTask({...item, ...changes});
      }
      //else
      return item;
    }));
    this._save();
    console.log("DEBUG: update task (service)", {id: taskId, changes, tasks: this._tasks()});
  }


  remove(task: ITask): boolean;
  remove(taskId: string): boolean;
  remove(arg: ITask | string): boolean {
    const id = Task.isTask(arg)
      ? arg.id
      : primitive.isString(arg)
        ? arg
        : null;
    if (!id) {
      throw new Error("ProjectService cannot remove task - missing task id");
    }
    const found = Boolean(this._tasks().find(m => m.id === id));
    if (!found) {
      return false;
    }

    //else remove from array and save
    this._tasks.update(items => items.filter(m => m.id === id));
    this._save();
    return true;
  }


  seed(tasks: ITask[]) {
    const taskList = tasks.map(t => this._newTask(t));
    this._tasks.set(taskList);
    this._save();
  }

  sort(info: SortInfo): void;
  sort(key: keyof ITask): void;
  sort(key: keyof ITask, direction: SortDirection): void;
  sort(arg1: (keyof ITask) | SortInfo, arg2?: SortDirection) {
    const key = primitive.isString(arg1)
      ? arg1
      : arg1.key;
    const direction = arg2 ?? 
      (primitive.isObject(arg1) 
        ? arg1.direction 
        : defaultSortInfo.direction
      );
    const tasks = [...this.tasks()];
    const comparer = this._comparer(key, direction);
    tasks.sort(comparer);
    this._tasks.set(tasks);
    this._sortInfo.set({key, direction});
    this._save();
  }

  //private (helper) methods

  private _init() {
    //initialize the list of tasks
    let tasks: ITask[] = []; //default to an empty list;
    const result = this.storage.get<ITask[]>(this.KEY);
    if (Array.isArray(result) && result.length > 0) {
      //validate integrity of the array by examining the first task
      if (Task.isTask(result[0])) {
        tasks = result.map(m => this._newTask(m));
      }
    }
    this._tasks.set(tasks);

    //get the saved sort info
    const sortInfo = this.storage.get<SortInfo>(this.KEY_SORT);
    if (objHelp.hasKeys<SortInfo>(sortInfo, ['key', 'direction'])) {
      this._sortInfo.set(sortInfo);
    }
  }

  private _newTask(obj?: ITask) {
    if (primitive.isObject(obj) && obj.projectId) {
      obj.project = this.projectService.get(obj.projectId);
    }
    return new Task(obj);
  }

  private _save() {
    this.storage.set(this.KEY, this._tasks());
    this.storage.set(this.KEY_SORT, this._sortInfo());
  }
  
  private _comparer(key: keyof ITask, direction: SortDirection): SortComparer {
    //default to a string comparison
    let comparer: SortComparer = (a,b) => {
      return direction === 'asc'
        ? strHelp.compare(a[key], b[key])
        : strHelp.compare(b[key], a[key]);
    };

    if (key === 'reminder' || key === 'lastUpdated') {
      comparer = (a,b) => {
        return direction === 'asc'
          ? dayjsHelp.compare(a[key], b[key])
          : dayjsHelp.compare(b[key], a[key]);
      }
    }

    return comparer;
  }
}