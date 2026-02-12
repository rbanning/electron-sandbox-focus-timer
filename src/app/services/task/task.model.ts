import dayjs from "dayjs";
import { castAs, Nullable } from "@common/types";
import { IProject, Project, projectStatusList } from "@services/project/project.model";
import { dayjsHelp, parsers, primitive, strHelp } from "@common/general";
import { using } from "@common/misc";
import { ProjectService } from "@services/project/project.service";

//NOTE: taskStatusList and projectStatusList are the same
export const taskStatusList = [
  ...projectStatusList
] as const;
export type TaskStatus = typeof taskStatusList[number];

export const taskTypeDictionary = {
  'business development': [
    'marketing',
    'sales',
    'proposals',              // RFPs, estimates, scoping
    'client relations',
    'teaching',               // includes workshops, mentoring, and blogging
    'professional development',  // catch all for professional development and personal enrichment 
  ],
  'client deliverable': [
    'research',               // Research associated with specific client project
    'design',                 // UI/UX, architecture, requirements
    'coding',                 // coding/implementation
    'data management',        // designing, gathering, cleaning, maintaining
    'data analytics',         // statistics, trends, insights
    'data visualization',     // dashboards, reports
    'media development',      // image processing
    'testing',                // QA
  ],
  'admin': [
    'finances',
    'legal',
    'operations',             // planning, team management
  ]
} as const;
export type TaskTypeGroup = keyof typeof taskTypeDictionary;
export const taskTypeGroups: TaskTypeGroup[] = castAs<TaskTypeGroup[]>(Object.keys(taskTypeDictionary));
export type TaskType = typeof taskTypeDictionary[TaskTypeGroup][number];
export const taskTypes: TaskType[] = castAs<TaskType[]>(Object.values(taskTypeDictionary));

export interface ITask {
  id: string;
  name: string;
  status: TaskStatus;
  type: TaskType;
  description?: Nullable<string>;

  projectId?: Nullable<string>;
  project?: Nullable<IProject>;     //navigation prop

  reminder?: Nullable<dayjs.Dayjs>;

  lastUpdated: dayjs.Dayjs;

  toJSON?: () => Omit<ITask, 'project'>;
}


export class Task implements ITask {
  id: string = strHelp.randomString(12);
  name: string = "";
  status: TaskStatus = "pending";
  type: TaskType = "operations";
  description?: Nullable<string>;

  projectId?: Nullable<string>;
  project?: Nullable<IProject>;     //navigation prop

  reminder?: Nullable<dayjs.Dayjs>;

  lastUpdated: dayjs.Dayjs = dayjsHelp.now();

  constructor(obj?: unknown) {
    using(obj as ITask, arg => {
      this.id = arg.id ?? this.id;
      this.name = arg.name ?? this.name;
      this.status = parsers.toStringUnionType(arg.status, taskStatusList) ?? this.status;
      this.type = parsers.toStringUnionType(arg.type, taskTypes) ?? this.type;
      this.description = arg.description ?? this.description;
      this.projectId = this.projectId ?? this.projectId;
      if (primitive.isObject(arg.project)) {
        if (arg.project.id === this.projectId) {
          this.project = new Project(arg.project);
        }
        else {
          throw new Error('Task projectId does not match the project object passed into the constructor');
        }
      }
      else if (primitive.isString(this.projectId)) {
        //get the project from the Project service;
        const service = new ProjectService();
        this.project = service.get(this.projectId);
        if (!this.project) { console.warn(`Task constructor could not find the associated project (project id: ${this.projectId})`)};
      }

      this.reminder = parsers.toDayjs(arg.reminder);
      this.lastUpdated = parsers.toDayjs(arg.lastUpdated) ?? this.lastUpdated;
    })
  }


  toJSON(): Omit<ITask, 'project'> {
    const clone = new Task(this);
    if (clone.project) {
      delete clone.project;
    }

    return clone;
  }

  public static isTask(obj?: unknown): obj is ITask {
    if (primitive.isObject(obj)) {
      //check for these (non-empty string) properties
      return ['id', 'name', 'status', 'type'].every(key => (key in obj) && primitive.isString(obj[key]) && obj[key].length > 0);
    }
    //else
    return false;
  }

}
