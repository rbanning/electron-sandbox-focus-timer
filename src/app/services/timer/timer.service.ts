import { computed, inject, Injectable, signal } from '@angular/core';
import { TimeObject, TimerUnit, timerUnits } from './timer-unit.type';
import { timeToSeconds } from './time-to-seconds';
import { TimerState } from './timer-state.type';
import { Nullable } from '@common/types';
import { AlarmService } from '../alarm/alarm.service';
import { StorageService } from '@services/storage/storage.service';
import { primitive, strHelp } from '@common/general';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  //constants
  private readonly KEY = "hallpass-timer"; //storage key;
  private readonly DELAY = 0.1; //seconds;

  //private (internal) properties
  private readonly _state = signal<TimerState>('idle');
  private readonly _time = signal<TimeObject>({value: 0, unit: 'second'});
  private readonly _remaining = signal(0);
  private readonly _percent = signal(0);

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


  constructor() {
    //initialize the time...
    const savedTime = this.storage.get<TimeObject>(this.KEY)
    if (primitive.isNumber(savedTime?.value) && strHelp.isStringUnionType<TimerUnit>(savedTime?.unit, timerUnits)) {
      this.setTime(savedTime.value, savedTime.unit);
    }
    else {
      this.setTime(1, 'minute');
      console.log("using default time", this.time());
    }
  }


  //public methods
  public setTime(value: number, unit: TimerUnit) {
    const time: TimeObject = { value, unit };
    this._time.set(time);
    this.storage.set(this.KEY, time);
    //regardless of the current state, changing the time automatically resets the timer 
    this.reset();
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

  private _clearInterval() {
    if (this._intervalId) {
      window.clearInterval(this._intervalId);
    }
  }

  
}