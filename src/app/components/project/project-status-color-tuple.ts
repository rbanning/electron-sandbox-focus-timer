import { ProjectStatus } from "@services/project/project.model";

export const projectStatusColorTuple: Record<ProjectStatus, [primary: string, secondary: string]> = {
  pending: ['gray', 'gray'],
  active: ['gray', 'cornflowerblue'],
  hold: ['gray', 'peru'],
  issue: ['gray', 'deeppink'],
  completed: ['gray', 'yellowgreen'],
  cancelled: ['gray', 'lightpink'],
} as const;