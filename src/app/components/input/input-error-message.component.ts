import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: 'app-input-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (state().invalid() && state().touched()) {
      <span class="flex flex-wrap gap-2 text-sm text-red-400">
        @for (error of state().errors(); track error.kind; let last = $last) {
          <span>{{error.message}}</span>
          @if (!last) {
            <span class="text-xs">&middot;</span>
          }
        }
      </span>
    }
  `,
  styles: ':host { display: block; }'
})
export class InputErrorMessageComponent<TFieldType> {

  state = input.required<FieldState<TFieldType>>();

}
