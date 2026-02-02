import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerService } from '@services/timer/timer.service';
import { TimerUnit, timerUnits } from '@services/timer/timer-unit.type';
import { exhaustiveCheck } from '@common/misc';
import { faPencilAlt as editIcon, faXmark as closeIcon } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { parsers, primitive, strHelp } from '@common/general';
import { TimerView, timerViews } from '@services/timer/timer-view.type';

const editorStates = ['available', 'open', 'disabled'] as const;
type EditorStates = typeof editorStates[number];

@Component({
  selector: 'app-timer-popup-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './timer-popup-editor.component.html',
  styleUrls: ['./timer-popup-editor.component.css']
})
export class TimerPopupEditorComponent implements OnInit {

  protected readonly timer = inject(TimerService);

  //signals
  protected timeValue = signal<number>(0);
  protected timeUnit = signal<TimerUnit>('second');
  protected units = timerUnits;
  protected view = signal<TimerView>('bar');
  protected views = timerViews;

  //maxTimeValue and stepTimeValue are used to in the input element
  protected maxTimeValue = computed(() => {
    const unit = this.timeUnit();
    switch(unit) {
      case 'second':
      case 'minute':
        return 60;
      case 'hour':
        return 24;
      case 'day':
        return 1000; //whatever
      default:
        exhaustiveCheck(unit);
    }
  });
  protected stepTimeValue = computed(() => {
    const unit = this.timeUnit();
    switch(unit) {
      case 'second':
        return 15;
      case 'minute':
        return 5;
      case 'hour':
        return .25;
      case 'day':
        return 1;
      default:
        exhaustiveCheck(unit);
    }
  });

  private readonly _open = signal<boolean>(false);
  protected readonly state = computed<EditorStates>(() => {
    if (this.timer.state() === 'running') {
      return 'disabled';
    }
    //else
    return this._open() 
      ? 'open'
      : 'available';
  });


  protected icons = {
    close: closeIcon,
    edit: editIcon    
  }
  


  // methods

  ngOnInit(): void {
    this._initTimeAndView();
  }

  saveEdits() {
    this.timer.setTime(this.timeValue(), this.timeUnit());
    this.timer.setView(this.view());
    this.toggle(); //close
  }

  cancelEdits() {
    //reset the timer value/unit
    this._initTimeAndView();
    this.toggle(); //close
  }

  capitalize = strHelp.capitalize;

  toggle() {
    this._open.update(m => !m);
  }

  onValueSelected(value: unknown) {
    const num = parsers.toNumber(value);
    if (primitive.isNumber(num)) {
      this.timeValue.set(num);
    }
    else {
      throw new Error(`onValueSelected() expects a number, but instead received: '${value}'` );
    }
  }
  onUnitSelected(unit: unknown) {
    if (strHelp.isStringUnionType<TimerUnit>(unit, timerUnits)) {
      this.timeUnit.set(unit);
    }
    else {
      throw new Error(`onUnitSelected() expects a valid timer unit, but instead received: '${unit}'` );
    }
  }
  onViewSelected(view: unknown) {
    if (strHelp.isStringUnionType<TimerView>(view, timerViews)) {
      this.view.set(view);
    }
    else {
      throw new Error(`onViewSelected() expects a valid timer view, but instead received: '${view}'` );
    }
  }


  // private (helper) methods
  private _initTimeAndView() {
    const { value, unit } = this.timer.time();
    this.timeValue.set(value);
    this.timeUnit.set(unit);
    this.view.set(this.timer.view());
  }
}
