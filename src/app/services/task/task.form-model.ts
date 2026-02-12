import { required, schema, validate } from '@angular/forms/signals';
import { dayjsHelp, objHelp, parsers } from '@common/general';
import { ITask, Task, taskStatusList } from './task.model';


/**
 * FOR USE WITH SIGNAL FORMS....
 * ITaskFormModel is used when editing a ITask
 * forms cannot have optional/null/undefined properties
 *   so we override them in the new interface
 */
export interface ITaskFormModel extends Omit<ITask, 
  'description' | 'reminder' | 'lastUpdated' | 'project' | 'toJSON'> {
  description: string;
  reminder: string;
  lastUpdated: string;
}

export function toITaskFormModel(task: ITask): ITaskFormModel {
  return {
    ...new Task(task).toJSON(),
    description: task.description ?? "",
    reminder: dayjsHelp.format.asInput(task.reminder, ''),
    lastUpdated: dayjsHelp.format.asInput(task.lastUpdated, ''),
  };
}
export const defaultITaskFormModel = toITaskFormModel(new Task({id: ''}));

export const taskFormModelSchema = schema<ITaskFormModel>((path) => {
  
  //note: using objHelp.asKeysOf() pattern so we can quickly add/remove fields from the validation requirement

  const x = path['id'];
  const k: keyof ITaskFormModel = 'id';
  const v = path[k];
  required(path[k], {})
  //required
  objHelp.asKeysOf<ITaskFormModel>(defaultITaskFormModel, 'id','name','status','type')
    .forEach(key => {
      const schemaPath = path[key];
      if (schemaPath) {
        required(schemaPath, { message: `${String(key)} is required`})
      }
    });


  //date (min && max)
  const dateYear = { min: 2000, max: new Date().getFullYear() + 1 };
  objHelp.asKeysOf<ITaskFormModel>(defaultITaskFormModel, 'reminder')
    .forEach(key => {
      const schemaPath = path[key];
      if (schemaPath) {
        validate(schemaPath, ({value}) => {
          const v = value();
          const d = parsers.toDayjs(v);
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
          else if ((v ?? '').length > 0) {
              return {
                kind: 'invalid-date',
                message: `${String(key)} must be a valid date`
              };
          }
          //else
          return null;
        }); // end validate
      }
    }
  );

})

