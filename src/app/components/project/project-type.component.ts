import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faBrowser, faChartScatterBubble, faCircle, faCircleCheck, faCircleDot, faCircleExclamation, faCircleMinus, faCircleXmark, faFeather, faGraduationCap, faWebAwesome, faWebhook, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { ProjectType } from '@services/todo/project.model';

@Component({
  selector: 'app-project-type',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <fa-duotone-icon
      [title]="type()" 
      [icon]="icons[type()]" 
      [size]="size()"
      [primaryColor]="colors[type()][0]"
      [secondaryOpacity]=".6"
      [secondaryColor]="colors[type()][1]"
    />
    <span class="sr-only">{{type()}}</span>
  `,
  styles: ':host { display: block; }'
})
export class ProjectTypeComponent {

  type = input<ProjectType>('other');
  size = input<SizeProp>('sm');

  icons: Record<ProjectType, IconDefinition> = {
    "web-app": faWebAwesome,
    "backend-api": faWebhook,
    "data-science": faChartScatterBubble,
    learning: faGraduationCap,
    other: faFeather,
  }

  colors: Record<ProjectType, [primary: string, secondary: string]> = {
    "web-app": ['gray', 'deepskyblue'],
    "backend-api": ['gray', 'darkorchid'],
    "data-science": ['gray', 'salmon'],
    learning: ['burlywood', 'magenta'],
    other: ['lightgrey', 'black'],
  }

}
