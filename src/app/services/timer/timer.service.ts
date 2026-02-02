import { computed, inject, Injectable, signal } from '@angular/core';
import { Nullable } from '@common/types';
import { primitive, strHelp } from '@common/general';
import { StorageService } from '@services/storage/storage.service';
import { AlarmService } from '@services/alarm/alarm.service';

import { TimerUnit } from './timer-unit.type';
import { isTimeObject, TimeObject } from './time-object.type';
import { timeToSeconds } from './time-to-seconds';
import { TimerState } from './timer-state.type';
import { TimerView, timerViews } from './timer-view.type';
import { isTimerStore, TimerStore } from './timer-store.type';


@Injectable({
  providedIn: 'root'
})
export class TimerService {
  //constants
  private readonly KEY = "hallpass-timer"; //storage key;
  private readonly DELAY = 0.1; //seconds;

  //private (internal) properties
  private readonly _state = signal<TimerState>('idle');
  private readonly _time = signal<TimeObject>({value: 0, unit: 'second'});  //updated in constructor
  private readonly _remaining = signal(0);
  private readonly _percent = signal(0);
  private readonly _view = signal<TimerView>(timerViews[0]);  //updated in constructor

  private _intervalId: Nullable<number>;

  //inject alarm and storage service
  private readonly alarm = inject(AlarmService);
  private readonly storage = inject(StorageService);

  //public readonly properties
  public readonly state = computed(() => this._state());
  public readonly time = computed(() => this._time());
  public readonly totalSeconds = computed(() => timeToSeconds(this._time()));
  public readonly remaining = computed(() => this._remaining());
  public readonly percent = computed(() => this._percent());
  public readonly view = computed(() => this._view());

  constructor() {  
    const current = this.storage.get<TimerStore>(this.KEY);
    const { time, view } = this._extractTimerStore(current);
    //initialize the time and view...
    this._time.set(time);
    this._remaining.set(timeToSeconds(time));
    this._percent.set(0);
    this._view.set(view);
    
  }


  //public methods
  public setTime(value: number, unit: TimerUnit) {
    const time: TimeObject = { value, unit };
    this._time.set(time);
    this._updateTimerStore(time);
    //regardless of the current state, changing the time automatically resets the timer 
    this.reset();
  }
  public setView(view: TimerView) {
    this._view.set(view);
    this._updateTimerStore(view);
  }

  public start() {    
    this._intervalId = window.setInterval(() => {
      this._update(this._remaining() - this.DELAY);
    }, this.DELAY * 1000);
    this._state.set('running');
    this.alarm.soundAlarm('short');
  }

  public stop() {
    this._state.set('complete');
    this._remaining.set(this.totalSeconds());
    this._percent.set(100);
    this._clearInterval();
    this.alarm.soundAlarm('double');
  }

  public reset() {
    this._state.set('idle');
    this._remaining.set(this.totalSeconds());
    this._percent.set(0);
    this._clearInterval();
  }

  public pause() {
    this._state.set(this._remaining() > 0 ? 'paused' : 'complete');
    this._clearInterval();
  }


  //private methods

  private _update(remaining: number) {
    if (remaining > 0) {
      this._remaining.set(remaining);
      this._percent.set((this.totalSeconds() - remaining) / this.totalSeconds() * 100);
    }
    else {
      this.stop();  //complete
    }
  }
  private _updateTimerStore(store: TimerStore): void;
  private _updateTimerStore(view: TimerView): void;
  private _updateTimerStore(time: TimeObject): void;
  private _updateTimerStore(obj: TimerStore | TimerView | TimeObject): void {    
    const time: TimeObject = isTimerStore(obj)
      ? obj.time
      : isTimeObject(obj)
        ? obj
        : this._time();

    const view: TimerView = isTimerStore(obj)
      ? obj.view
      : strHelp.isStringUnionType<TimerView>(obj, timerViews)
        ? obj
        : this._view();
   
    this.storage.set(this.KEY, { time, view });
  }
  private _extractTimerStore(obj: unknown): TimerStore {
    const ret: TimerStore = {
      time: { value: 30, unit: 'second' },
      view: 'ring'
    };

    if (primitive.isObject(obj)) {
      //get the time (TimeObject)
      if ('time' in obj && isTimeObject(obj['time'])) {
        ret.time = obj['time'];
      }
      else {
        console.log('note >> TimerStore does not have a valid TimeObject', obj);
      }
      //get the view (TimerView)
      if ('view' in obj && strHelp.isStringUnionType<TimerView>(obj['view'], timerViews)) {
        ret.view = obj['view'];        
      }
      else {
        console.log('note >> TimerStore does not have a valid TimerView', obj);
      }
    }
    return ret;
  }

  private _clearInterval() {
    if (this._intervalId) {
      window.clearInterval(this._intervalId);
    }
  }

  
}