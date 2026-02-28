import { primitive } from '@common/general';
import { Component, computed, input, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleEllipsisVertical, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { Nullable } from '@common/types';

export type ActionOption = {
  action: string;
  icon: IconDefinition;
  title: string;
  disabled?: Nullable<boolean>;
}

@Component({
  selector: 'app-expanding-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
<div 
  class="pop-menu"
  [class.open]="active() === true" >
    <button 
      type="button"
      [title]="trigger().title"
      (click)="toggleMenu(!active())"
      [disabled]="trigger().disabled === true"
      [class.rotate]="active() === true"
      class="btn"
    >
      <fa-duotone-icon [icon]="trigger().icon" size="1x" secondaryColor="cornflowerblue" />
    </button>
  @if (active() === true) {
    @for(item of actions(); track item.action) {
      <button 
        type="button"
        [title]="item.title"
        (click)="handleClick(item)"
        [disabled]="item.disabled === true"
        animate.enter="enter-fade-in"
        animate.leave="leave-fade-out"
        (mouseenter)="resetTimer()"
        class="btn"
      >
        <fa-duotone-icon [icon]="item.icon" size="1x" secondaryColor="cornflowerblue" />
      </button>
    }
  }
</div>
  `,
  styleUrls: ['./expanding-menu.component.css','../common/enter-leave-styles.css']
})
export class ExpandingMenuComponent implements OnDestroy {

  //input
  actions = input.required<ActionOption[]>();
  triggerInput = input<Partial<Omit<ActionOption, 'action'>>>({}, { alias: 'trigger' });

  //output  
  activate = output<ActionOption>();
  
  
  //protected 
  protected readonly active = signal(false);

  protected trigger = computed<ActionOption>(() => {
    return {
      action: 'trigger',
      icon: faCircleEllipsisVertical,
      title: this.active() ? 'Close Menu' : 'Open Menu',
      ...this.triggerInput(),
    };
  })

  private timeoutId = signal<Nullable<number>>(null); 

  ngOnDestroy(): void {
    this.clearTimer();
  }

  //methods

  protected toggleMenu(active: boolean) {
    this.active.set(active);
    if (active) {
      this.resetTimer();
    }
  }

  protected handleClick(option: ActionOption) {
    this.activate.emit(option);
  }

  protected resetTimer() {
    this.clearTimer();
    this.timeoutId.set(
      window.setTimeout(() => {
        this.toggleMenu(false);
      }, 5000)
    );
  }

  private clearTimer() {
    const timeoutId = this.timeoutId();
    if (primitive.isNumber(timeoutId)) {
      window.clearTimeout(timeoutId);
    }
  }
}
