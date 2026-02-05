import { required, schema, validate } from '@angular/forms/signals';
import { dayjsHelp, objHelp, parsers } from '@common/general';
import { IProject, Project } from './project.model';


/**
 * FOR USE WITH SIGNAL FORMS....
 * IProjectFormModel is used when editing a IProject
 * forms cannot have optional/null/undefined properties
 *   so we override them in the new interface
 */
export interface IProjectFormModel extends Omit<IProject, 'startDate' | 'lastUpdated'> {
  startDate: string;
  lastUpdated: string;
}

export function toIProjectFormModel(project: IProject): IProjectFormModel {
  return {
    ...project,
    startDate: dayjsHelp.format.asInput(project.startDate, ''),
    lastUpdated: dayjsHelp.format.asInput(project.lastUpdated, ''),
  };
}
export const defaultIProjectFormModel = toIProjectFormModel(new Project({id: ''}));

export const projectFormModelSchema = schema<IProjectFormModel>((path) => {
  
  //note: using objHelp.asKeysOf() pattern so we can quickly add/remove fields from the validation requirement

  //required
  objHelp.asKeysOf<IProjectFormModel>(defaultIProjectFormModel, 'id','name','status','type')
    .forEach(key => required(path[key as keyof IProjectFormModel], { message: `${String(key)} is required`}));

  //date (min && max)
  const dateYear = { min: 2000, max: new Date().getFullYear() + 1 };
  objHelp.asKeysOf<IProjectFormModel>(defaultIProjectFormModel, 'startDate')
    .forEach(key => validate(path[key], ({value}) => {
      const d = parsers.toDayjs(value());
      if (dayjsHelp.isDayJs(d)) {
        if (d.year() < dateYear.min) {
          return {
            kind: 'min',
            message: `${String(key)} must after ${dateYear.min-1}`
          };          
        }
        else if (d.isAfter(`${dateYear.max}-12-31`)) {
          return {
            kind: 'max',
            message: `${String(key)} must be before ${dateYear.max+1}`
          };
        }
      }
      else if (value().length > 0) {
          return {
            kind: 'invalid-date',
            message: `${String(key)} must be a valid date`
          };
      }
      
      //else
      return null;
    }));

  //capitalize
  objHelp.asKeysOf<IProjectFormModel>(defaultIProjectFormModel, 'name')
    .forEach(key => validate(path[key], ({value}) => {
      const startsWith = value().charAt(0);
      if (startsWith !== startsWith.toUpperCase()) {
        return {
          kind: 'capitalize',
          message: `${String(key)} must be Capitalized`
        };
      }
      //else
      return null;
    }));

})

