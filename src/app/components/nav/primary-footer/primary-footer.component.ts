import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@src/environments/environment';
import { TimerService } from '@services/timer/timer.service';
import { ElectronService } from '@services/electron/electron.service';

@Component({
  selector: 'app-primary-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primary-footer.component.html',
  styles: ':host { display: block; }'
})
export class PrimaryFooterComponent {
  protected readonly copyright = signal(environment.copyright);
  protected readonly version = signal(environment.version);
  protected readonly date = signal(new Date().getFullYear());

  protected timer = inject(TimerService);
  protected electron = inject(ElectronService);

  protected readonly versions = computed(() => {
    if (this.electron.isElectron()) {
      return this.electron.getVersionKeys().reduce((ret, key) => {
        ret.push({ key, value: this.electron.getVersion(key) });
        return ret;
      }, [] as { key: string, value: string }[]);
    }
    else {
      return [];
    }
  })

  async ping() {
    const resp = await this.electron.ping();
    console.log("PING ...", resp);
  }
}
