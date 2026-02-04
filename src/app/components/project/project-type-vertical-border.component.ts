import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, SizeProp } from '@fortawesome/angular-fontawesome';
import { faChartScatterBubble, faFeather, faGraduationCap, faWebAwesome, faWebhook, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { ProjectType } from '@services/project/project.model';
import { productTypeColorTuple } from './project-type-color-tuple';

@Component({
  selector: 'app-project-type-vertical-border',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div
      [title]="type()" 
      class="absolute top-0 left-0 w-2 h-full opacity-20 group-hover:opacity-50 transition-opacity duration-1000 z-2"
      [style.backgroundColor]="color()"
    >
      <span class="sr-only">{{type()}}</span>
    </div>
  `,
  styles: ':host { display: block; }'
})
export class ProjectTypeVerticalBorderComponent {

  type = input.required<ProjectType>();
  color = computed(() => productTypeColorTuple[this.type()][1]); 

}
