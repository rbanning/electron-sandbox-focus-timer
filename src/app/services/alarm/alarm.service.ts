import { Injectable } from '@angular/core';
import { exhaustiveCheck } from '@common/misc';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
 
  //public methods
  public soundAlarm(sound: 'short' | 'double' | 'triple') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const currentTime = audioContext.currentTime;
      
      switch(sound) {
        case 'short':
          // Non-intrusive single beep
          this.playTone(audioContext, 800, 0.1, 0.15, currentTime); // 800Hz, low volume, 150ms
          break;
        case 'double':
          // Louder double beep 
          this.playTone(audioContext, 1000, 0.3, 0.2, currentTime); // 1000Hz, louder, 200ms
          this.playTone(audioContext, 1000, 0.3, 0.2, currentTime + 0.25); // Second beep after 250ms
          break;
        case 'triple':
          // Louder longer triple beep
          this.playTone(audioContext, 1000, 0.3, 0.25, currentTime); // 1000Hz, louder, 250ms
          this.playTone(audioContext, 1000, 0.3, 0.25, currentTime + 0.35); // Second beep after 300ms
          this.playTone(audioContext, 1000, 0.3, 0.25, currentTime + 0.6); // Second beep after 600ms
          break;
        
        default:
          exhaustiveCheck(sound);
      }
    } catch (error) {
      console.warn('Could not play alarm sound:', error);
    }
  }


  //private helper methods
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