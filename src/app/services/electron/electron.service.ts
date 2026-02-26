import { Injectable } from '@angular/core';
import { ApiVersions, IElectronAPI, NotificationPayload } from '@src/types';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private api: IElectronAPI;
  
  constructor() {
    if ('electronAPI' in window) {
      this.api = window.electronAPI;
    }
    else {
      this.api = this.scaffoldAPI();
    }
  }

  isElectron() { 
    return this.api.isElectron;
  }
  getVersionKeys() {
    return Object.keys(this.api.apiVersions) as (keyof ApiVersions)[];
  }
  getVersion(key: keyof ApiVersions) {
    return this.api.apiVersions[key]();
  }

  // >> Messaging <<
  async ping() {
    return await this.api.messaging.ping();
  }
  async showNotification(title: string, body: string) {
    return await this.api.messaging.showNotification({title, body});
  }


  // >> Private <<

  private scaffoldAPI(): IElectronAPI {
    return {
      isElectron: false,
      apiVersions: {
        chrome: () => "?",
        node: () => "?",
        electron: () => "?",
      },
      messaging: {
        ping: () => Promise.resolve(null),
        showNotification: (payload: NotificationPayload) => Promise.resolve(false),
      }
    }
  }
}