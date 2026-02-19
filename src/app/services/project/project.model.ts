import { dayjsHelp, parsers, primitive, strHelp } from "@common/general";
import { using } from "@common/misc";
import { Nullable } from "@common/types";
import dayjs from "dayjs";

export const projectStatusList = [
  'pending',    //not started
  'active',     //in progress
  'hold',       //waiting (input, resources, time)
  'issue',      //problem - needs attention
  'completed',   //success
  'cancelled',  //dead
] as const;
export type ProjectStatus = typeof projectStatusList[number];

export const projectTypeList = [
  'web-app',
  'backend-api',
  'data-science',
  'learning',
  'other',
] as const;
export type ProjectType = typeof projectTypeList[number];

export interface IProject {
  id: string;  
  name: string;
  status: ProjectStatus;
  type: ProjectType;
  client: string;
  startDate: Nullable<dayjs.Dayjs>;
  lastUpdated: Nullable<dayjs.Dayjs>;
}


/// ---- PROJECT CLASS ----
export class Project {

  public static readonly INTERNAL_CLIENT = "(internal)";

  id: string = strHelp.randomString(6);
  name: string = "New Project";
  status: ProjectStatus = "pending";
  type: ProjectType = "other";
  client: string = Project.INTERNAL_CLIENT;
  startDate: Nullable<dayjs.Dayjs>;
  lastUpdated: Nullable<dayjs.Dayjs>;

  constructor(obj?: unknown) {
    using(obj as IProject, arg => {
      this.id = parsers.toString(arg.id) ?? this.id;
      this.name = parsers.toString(arg.name) ?? this.name;
      this.status = parsers.toStringUnionType(arg.status, projectStatusList) ?? this.status;
      this.type = parsers.toStringUnionType(arg.type, projectTypeList) ?? this.type;
      this.client = parsers.toString(arg.client) ?? this.client;
      this.startDate = parsers.toDayjs(arg.startDate);
      this.lastUpdated = parsers.toDayjs(arg.lastUpdated);
    });
  }

  public static isProject(obj?: unknown): obj is IProject {
    if (primitive.isObject(obj)) {
      //check for these (non-empty string) properties
      return ['id', 'name', 'status', 'type', 'client'].every(key => (key in obj) && primitive.isString(obj[key]) && obj[key].length > 0);
    }
    //else
    return false;
  }

  public static changes(current: IProject, pending: IProject) {
    const ret: Partial<Record<keyof IProject, IProject[keyof IProject]>> = {};
    const patchableFields: (keyof IProject)[] = [
      // id cannot be updated 
      // lastUpdated is automatically updated
      'name',
      'status',
      'type',
      'client',
      'startDate',
    ];

    const equals = (key: keyof IProject): boolean => {
      const currentValue = current[key];
      const pendingValue = pending[key];

      if (key === 'startDate') {
        return dayjsHelp.equals(current.startDate, pending.startDate);
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

    return ret as Partial<IProject>;
  }

}

