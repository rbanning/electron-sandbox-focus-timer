import dayjs from "dayjs";
import { castAs, Nullable } from "@common/types";
import { IProject, Project, projectStatusList } from "@services/project/project.model";
import { dayjsHelp, parsers, primitive } from "@common/general";
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
  ],
  'client deliverable': [
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
    'operations',             // planning, team mgmt
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
  id: string = "";
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
}
