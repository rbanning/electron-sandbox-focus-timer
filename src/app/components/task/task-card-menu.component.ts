import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck, faCirclePause, faCirclePlay, faPencilAlt, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { TaskStatus } from '@services/task/task.model';
import { exhaustiveCheck } from '@common/misc';
import { ActionOption, ExpandingMenuComponent } from '@components/general/expanding-menu.component';
import { parsers } from '@common/general';

export const actions = ['edit', 'start', 'hold', 'completed'] as const;
export type Action = typeof actions[number];

const icons: Record<Action, IconDefinition> = {
  edit: faPencilAlt,
  start: faCirclePlay,
  hold: faCirclePause,
  completed: faCircleCheck,
} as const;

const allActions: Record<Action, ActionOption> = {
    edit: { action: 'edit', title: 'Edit the Task', icon: icons.edit },
    start: { action: 'start', title: 'Start the Task', icon: icons.start },
    hold: { action: 'hold', title: 'Put the Task on Hold', icon: icons.hold },
    completed: { action: 'completed', title: 'Mark the Task as Completed', icon: icons.completed },
} as const;

@Component({
  selector: 'app-task-card-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ExpandingMenuComponent],
  template: `
    <app-expanding-menu [actions]="actionList()" (activate)="handleClick($event)" />
  `,
  styles: `
    :host {
      display: block;
      transform: translateY(-4px) translateX(4px)
    }
  `
})
export class TaskCardMenuComponent {

  //input
  originalStatus = input.required<TaskStatus>({
    alias: 'status'
  });

  //output  
  activate = output<Action>();
    
  //protected 
  protected readonly status = signal<TaskStatus>('pending');

  protected readonly actionList = computed<ActionOption[]>(() => {
    const ret: ActionOption[] = [allActions.edit];  //everyone gets edit

    const status = this.status();
    switch(status) {
      case 'pending':
        ret.push(allActions.start);
        ret.push(allActions.hold);
        break;
      case 'active':
        ret.push(allActions.hold);
        ret.push(allActions.completed);
        break;
      case 'hold':
        ret.push(allActions.start);
        break;
      case 'issue':
        ret.push(allActions.start);
        ret.push(allActions.hold);
        break;
      case 'completed':
        ret.push(allActions.start);
        ret.push(allActions.hold);
        break;
      case 'cancelled':
        // no quick edits
        break;

      default:
        exhaustiveCheck(status);
    }
    return ret;
  });

  constructor() {
    effect(() => {
      this.status.set(this.originalStatus());
    });
  }

  //methods

  protected handleClick(option: ActionOption) {
    const action = parsers.toStringUnionType(option.action, actions);
    if (action) {
      this.activate.emit(action);
    }
    else {
      console.warn("Task Card Menu: unknown action triggered", {option});
    }
  }

}
