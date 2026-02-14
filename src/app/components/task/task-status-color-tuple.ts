import { TaskStatus } from "@services/task/task.model";

export const taskStatusColorTuple: Record<TaskStatus, [primary: string, secondary: string]> = {
  pending: ['gray', 'gray'],
  active: ['gray', 'cornflowerblue'],
  hold: ['gray', 'peru'],
  issue: ['gray', 'deeppink'],
  completed: ['gray', 'yellowgreen'],
  cancelled: ['gray', 'lightpink'],
} as const;