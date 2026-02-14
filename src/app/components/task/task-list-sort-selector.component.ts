import { Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpShortWide, faArrowDownWideShort } from '@fortawesome/pro-duotone-svg-icons';

import { castAs, Nullable } from '@common/types';
import { ITask, Task } from '@services/task/task.model';
import { SortDirection, SortInfo } from '@services/task/task.service';

@Component({
  selector: 'app-task-list-sort-selector',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
<span class="inline-flex flex-wrap items-center gap-4">
  @for (key of keys; track key) {
    <span class="py-1 px-2 bg-slate-300/70 hover:bg-slate-300 rounded-md" [class.current]="key === sortInfo().key">
      <span>{{key}}</span>
      @for (direction of directions; track direction) {
        <button
          type="button"
          [title]="direction"
          (click)="update(key, direction)"
          class="mx-2 py-1 px-2 border rounded cursor-pointer hover:border-white"
          [class.active]="direction === sortInfo().direction"
        >
        <fa-duotone-icon [icon]="icons[direction]" />
        <span class="sr-only">sort by {{key}} {{direction}}</span>
        </button>
      }
    </span>
  }
</span>
  `,
  styles: `
:host { 
  display: block; 
  .current {
    background: blue;
    color: white;
    .active {
      font-weight: bold;
    }
  }
}
`
})
export class TaskListSortSelectorComponent {

  currentKey = input<Nullable<keyof ITask>>(null, {
    alias: 'key'
  });
  currentDirection = input<Nullable<SortDirection>>(null, {
    alias: 'direction'
  });

  save = output<SortInfo>();

  protected sortInfo = signal<Partial<SortInfo>>({});
  protected keys = castAs<(keyof ITask)[]>(Object.keys(new Task()));
  protected directions: SortDirection[] = ['asc', 'desc']
  protected icons = {
    asc: faArrowUpShortWide,
    desc: faArrowDownWideShort, 
  }
  
  constructor() {
    effect(() => {
      this.update(this.currentKey(), this.currentDirection());
    })
  }

  protected update(key: Nullable<keyof ITask>, direction: Nullable<SortDirection>) {
    const info = {
      key: key ?? undefined,
      direction: direction ?? undefined,
    };
    this.sortInfo.set(info);
    if (info.key && info.direction) {
      this.save.emit(castAs<SortInfo>(info));
    }
  }

}
