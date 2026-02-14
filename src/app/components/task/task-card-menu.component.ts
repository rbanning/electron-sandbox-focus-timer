import { Component, computed, effect, ElementRef, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck, faCircleEllipsis, faCircleEllipsisVertical, faCirclePause, faCirclePlay, faEllipsis, faEllipsisVertical, faPencilAlt, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { TaskStatus } from '@services/task/task.model';
import { exhaustiveCheck, using } from '@common/misc';

export const actions = ['edit', 'start', 'hold', 'completed'] as const;
export type Action = typeof actions[number];

export type MenuIconType = 'vertical' | 'horizontal' | 'circle-vertical' | 'circle-horizontal';

type ClientXY = { x: number, y: number };

@Component({
  selector: 'app-task-card-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <button 
      type="button"
      title="toggle the task menu"
      (click)="toggle()"
      class="p-1 cursor-pointer text-slate-400 hover:text-slate-500" 
    >
      <fa-duotone-icon [icon]="menuIcon()" size="lg" primaryColor="black" />
    </button>
    @if(active()) {
      <div class="fixed z-20 flex flex-col py-2 bg-slate-100 border-2 rounded" 
        [style.top]="client().y" [style.left]="client().x">
        @for(action of actionList; track action) {
          <button 
            type="button"
            [title]="actionTitle()[action]"
            [disabled]="disabled()[action]"
            (click)="handleClick(action)"
            class="px-3 py-2 cursor-pointer disabled:opacity-40 disabled:cursor-none hover:bg-slate-200"
          >
            <fa-duotone-icon [icon]="icons[action]" size="lg" secondaryColor="cornflowerblue" />
          </button>
        }
      </div>
    }
  `,
  styles: ':host { display: block; }'
})
export class TaskCardMenuComponent {

  //input
  originalStatus = input.required<TaskStatus>({
    alias: 'status'
  });
  type = input<MenuIconType>('circle-vertical');

  //output  
  activate = output<Action>();
  
  //DI
  protected readonly selfRef = inject(ElementRef);
  
  //protected 
  protected readonly status = signal<TaskStatus>('pending');
  protected readonly active = signal(false);
  protected readonly client = signal<ClientXY>({x:0,y:0});

  protected readonly actionTitle = computed<Record<Action, string>>(() => ({
    edit: 'Edit the task',
    start: 'Update status to "active" and set the start date',
    hold: 'Update the status to "hold"',
    completed: 'Update the status to "completed"',
  }));
  protected readonly disabled = computed<Record<Action, boolean>>(() => {
    const status = this.status();
    return {
      edit: false,
      start: status === 'active',       //can only set status to start when the current status does NOT equal 'active'
      hold: status === 'hold'
        || status === 'cancelled',         //can only set status to 'hold' when the current status does NOT equals 'cancelled'
      completed: status !== 'active'   //can only set status to 'completed' when current status equals 'active'
    };
  });
  protected readonly menuIcon = computed<IconDefinition>(() => this.updateMenuIcon(this.type()));
  protected readonly icons: Record<Action, IconDefinition> = {
    edit: faPencilAlt,
    start: faCirclePlay,
    hold: faCirclePause,
    completed: faCircleCheck,
  };
  protected readonly actionList = actions;

  constructor() {
    effect(() => {
      this.status.set(this.originalStatus());
    });
  }

  //methods
  protected toggle() {
    using(this.selfRef.nativeElement as Element, el => {
      const { x, y } = el.getBoundingClientRect();
      this.client.set({x,y});
    })
    this.active.update(v => !v);
  }

  protected handleClick(action: Action) {
    this.active.set(false);
    this.activate.emit(action);
  }
  
  //private (helper) methods
  private updateMenuIcon(type: MenuIconType) {
    switch (type) {
      case 'vertical':
        return faEllipsisVertical; 
      case 'circle-vertical':
        return faCircleEllipsisVertical; 
      case 'horizontal':
        return faEllipsis; 
      case 'circle-horizontal':
        return faCircleEllipsis; 
      default:
        exhaustiveCheck(type);
    }
  }

}
