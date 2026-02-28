import dayjs from "dayjs";
import { castAs, Nullable } from "@common/types";
import { IProject, Project, projectStatusList } from "@services/project/project.model";
import { dayjsHelp, objHelp, parsers, primitive, strHelp } from "@common/general";
import { using } from "@common/misc";

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
export const taskTypes: TaskType[] = castAs<TaskType[]>(Object.values(taskTypeDictionary).flat());

export interface ITaskBase {
  id: string;
  name: string;
  status: TaskStatus;
  type: TaskType;
  description?: Nullable<string>;

  projectId?: Nullable<string>;
  reminder?: Nullable<dayjs.Dayjs>;
  startDate?: Nullable<dayjs.Dayjs>;
  endDate?: Nullable<dayjs.Dayjs>;
  lastUpdated: dayjs.Dayjs;
}

export class TaskBase implements ITaskBase {
  id: string = strHelp.randomString(12);
  name: string = "";
  status: TaskStatus = "pending";
  type: TaskType = "operations";
  description?: Nullable<string>;

  projectId?: Nullable<string>;
  reminder?: Nullable<dayjs.Dayjs>;
  startDate?: Nullable<dayjs.Dayjs>;
  endDate?: Nullable<dayjs.Dayjs>;
  lastUpdated: dayjs.Dayjs = dayjsHelp.now();

  constructor(obj?: unknown) {
    using(obj as ITask, arg => {
      this.id = arg.id ?? this.id;
      this.name = arg.name ?? this.name;
      this.status = parsers.toStringUnionType(arg.status, taskStatusList) ?? this.status;
      this.type = parsers.toStringUnionType(arg.type, taskTypes) ?? this.type;
      this.description = arg.description ?? this.description;
      this.projectId = arg.projectId ?? this.projectId;
      this.reminder = parsers.toDayjs(arg.reminder);
      this.startDate = parsers.toDayjs(arg.startDate);
      this.endDate = parsers.toDayjs(arg.endDate);
      this.lastUpdated = parsers.toDayjs(arg.lastUpdated) ?? this.lastUpdated;
    })
  }

  public static isTask(obj?: unknown): obj is ITask {
    if (primitive.isObject(obj)) {
      //check for these (non-empty string) properties
      return ['id', 'name', 'status', 'type'].every(key => (key in obj) && primitive.isString(obj[key]) && obj[key].length > 0);
    }
    //else
    return false;
  }

  public static changes(current: ITaskBase, pending: ITaskBase) {
    const ret: Partial<Record<keyof ITaskBase, ITaskBase[keyof ITaskBase]>> = {};
    const dateFields = ['reminder', 'startDate', 'endDate'] as (keyof ITaskBase)[];
    const patchableFields: (keyof ITaskBase)[] = [
      // id cannot be updated 
      // lastUpdated is automatically updated
      'name',
      'status',
      'type',
      'description',
      'projectId',
      ...dateFields
    ];

    const equals = (key: keyof ITaskBase): boolean => {
      const currentValue = current[key];
      const pendingValue = pending[key];

      if (dateFields.includes(key)) {        
        return dayjsHelp.equals(currentValue as Nullable<dayjs.Dayjs>, pendingValue as Nullable<dayjs.Dayjs>);
      }

      // treat null and undefined as the same
      if (primitive.isNullish(currentValue) && primitive.isNullish(pendingValue)) {
        return true;
      }

      return currentValue === pendingValue;
    };

    patchableFields.forEach((key) => {
      if (!equals(key)) {
        ret[key] = pending[key];
      }
    });

    return ret as Partial<ITaskBase>;
  }
}

export interface ITask extends ITaskBase {
  project?: Nullable<IProject>;     //navigation prop
  toJSON?: () => ITaskBase;
}


export class Task extends TaskBase implements ITask {
  project?: Nullable<IProject>;     //navigation prop
  constructor(obj?: unknown) {
    super(obj);
    using(obj as ITask, arg => {
      if (primitive.isObject(arg.project)) {
        if (arg.project.id === this.projectId) {
          this.project = new Project(arg.project);
        }
        else {
          throw new Error('Task projectId does not match the project object passed into the constructor');
        }
      }
    })
  }


  toJSON(): ITaskBase {
    return new TaskBase(this);
  }

  public static override changes(current: ITask, pending: ITask) {
    return TaskBase.changes(current, pending);
  }
}
