import { ProjectType } from '@services/project/project.model';

export const productTypeColorTuple: Record<ProjectType, [primary: string, secondary: string]> = {
  'web-app': ['gray', 'deepskyblue'],
  'backend-api': ['gray', 'darkorchid'],
  'data-science': ['gray', 'salmon'],
  learning: ['burlywood', 'magenta'],
  other: ['lightgrey', 'black'],
};
