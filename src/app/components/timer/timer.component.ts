import { Component, computed, input, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerBarComponent } from './timer-bar.component';
import { TimerRingComponent } from './timer-ring.component';
import { Nullable } from '@common/types';
import { TimerState } from './timer-state.type';
import { faPause, faPlay, faStop, faPowerOff } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { strHelp } from '@common/general';
import { TimerFillComponent } from './timer-fill.component';
import { TimeObject } from './timer-unit.type';
import { timeToSeconds } from './time-to-seconds';

const timerViews = ['ring', 'bar', 'fill'] as const;
type TimerView = typeof timerViews[number];


@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, TimerBarComponent, TimerRingComponent, TimerFillComponent, FontAwesomeModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnDestroy {

  // inputs
  time = input<TimeObject>({ value: 2, unit: 'minute' });

  // signals
  protected totalTime = computed(() => timeToSeconds(this.time())); //seconds  
  protected remaining = signal(0);
  protected percent = signal(0);
  protected state = signal<TimerState>('idle');
  protected view = signal<TimerView>(timerViews[0]);
  protected views = signal(timerViews);

  private intervalId: Nullable<number>;

  protected capitalize = strHelp.capitalize;

  protected icons = {
    start: faPlay,
    pause: faPause,
    stop: faStop,
    restart: faPowerOff,
  }

  setView(view: TimerView) {
    this.view.set(view);
  }


  start() {
    this.intervalId = window.setInterval(() => {
      this.update(this.remaining() - 0.1);
    }, 100);
    this.state.set('running');
    this.soundAlarm('running');    
  }

  restart() {
    this.remaining.set(this.totalTime());
    this.percent.set(0);
    this.start();
  }

  pause() {
    this.state.set(this.remaining() > 0 ? 'paused' : 'complete');
    this.clearInterval();
  }

  stop() {  
    this.remaining.set(this.totalTime());
    this.percent.set(100);  
    this.state.set('complete');
    this.clearInterval();
    this.soundAlarm('complete');
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }
  
  private update(value: number) {

    if (value > 0) {
      this.remaining.set(value);
      this.percent.set((this.totalTime() - value) / this.totalTime() * 100);
    }
    else {
      this.stop()
    }
  }

  private clearInterval() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  private soundAlarm(sound: 'complete' | 'running') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const currentTime = audioContext.currentTime;
      
      if (sound === 'running') {
        // Non-intrusive single beep for timer start
        this.playTone(audioContext, 800, 0.1, 0.15, currentTime); // 800Hz, low volume, 150ms
      } else if (sound === 'complete') {
        // Louder double beep for timer end
        this.playTone(audioContext, 1000, 0.3, 0.2, currentTime); // 1000Hz, louder, 200ms
        this.playTone(audioContext, 1000, 0.3, 0.2, currentTime + 0.25); // Second beep after 250ms
      }
    } catch (error) {
      console.warn('Could not play alarm sound:', error);
    }
  }

  private playTone(
    audioContext: AudioContext,
    frequency: number,
    volume: number,
    duration: number,
    startTime: number
  ) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    // envelope for smoother sound
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
  
}
