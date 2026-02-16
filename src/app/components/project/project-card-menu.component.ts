import { Component, computed, effect, ElementRef, inject, input, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck, faCircleEllipsis, faCircleEllipsisVertical, faCirclePause, faCirclePlay, faEllipsis, faEllipsisVertical, faPencilAlt, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { ProjectStatus } from '@services/project/project.model';
import { exhaustiveCheck } from '@common/misc';
import { Nullable } from '@common/types';

export const actions = ['edit', 'start', 'hold', 'completed'] as const;
export type Action = typeof actions[number];
export type ActionOption = {
  action: Action;
  icon: IconDefinition;
  title: string;
}

const icons: Record<Action, IconDefinition> = {
  edit: faPencilAlt,
  start: faCirclePlay,
  hold: faCirclePause,
  completed: faCircleCheck,
} as const;

const allActions: Record<Action, ActionOption> = {
    edit: { action: 'edit', title: 'Edit the Project', icon: icons.edit },
    start: { action: 'start', title: 'Start the Project', icon: icons.start },
    hold: { action: 'hold', title: 'Mark the Project as Hold', icon: icons.hold },
    completed: { action: 'completed', title: 'Mark the Project as Completed', icon: icons.completed },
} as const;

const menuStates = ['open', 'closed', 'disabled'] as const;
type MenuState = typeof menuStates[number];

@Component({
  selector: 'app-project-card-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    @if (menuState() === 'closed') {
      <button 
        type="button"
        title="Show Edit Menu"
        (click)="toggleMenu('open')"
        animate.enter="enter-fade-in-from-above"
        animate.leave="leave-fade-out-to-above"
        class="-translate-y-1 px-3 py-1 cursor-pointer hover:bg-slate-200"
      >
        <fa-duotone-icon [icon]="menuIcon" size="1x" secondaryColor="cornflowerblue" />
      </button>
    } 
    @else if (menuState() === 'open') {
      <div 
        animate.enter="enter-fade-in-from-below"
        animate.leave="leave-fade-out-to-below"
        (mouseover)="resetMenuTimer()"
        class="flex flex-col bg-white border border-slate-100 rounded" >
        @for(item of actionList(); track item.action) {
          <button 
            type="button"
            [title]="item.title"
            (click)="handleClick(item.action)"
            class="px-3 py-1 cursor-pointer hover:bg-slate-200"
          >
            <fa-duotone-icon [icon]="item.icon" size="1x" secondaryColor="cornflowerblue" />
          </button>
        }
      </div>
    }
  `,
  styleUrls: ['../common/enter-leave-styles.css']
})
export class ProjectCardMenuComponent implements OnDestroy {

  //input
  originalStatus = input.required<ProjectStatus>({
    alias: 'status'
  });

  //output  
  activate = output<Action>();
  
  
  //protected 
  protected readonly status = signal<ProjectStatus>('pending');

  protected menuState = signal<MenuState>('closed');
  protected menuIcon = faCircleEllipsisVertical;
  protected menuTimeout: Nullable<number> = null;


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

  ngOnDestroy(): void {
    this.clearMenuTimer();
  }

  //methods

  protected toggleMenu(state: MenuState) {
    this.menuState.set(state);
    if (state === 'open') {
      this.resetMenuTimer();
    }
    else {
      this.clearMenuTimer();
    }
  }

  protected resetMenuTimer() {
    this.clearMenuTimer();
    this.setMenuTimer();
  }

  protected handleClick(action: Action) {
    this.activate.emit(action);
  }

  //private
  private setMenuTimer() {
    this.menuTimeout = window.setTimeout(() => {
      this.toggleMenu('closed');
    }, 7000);
  }
  private clearMenuTimer() {
    if (this.menuTimeout) {
      window.clearTimeout(this.menuTimeout);
    }
  }
}
