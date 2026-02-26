// Types exposed by Electron

export type ApiVersions = {
  chrome: () => string;
  node: () => string;
  electron: () => string;
};

export type NotificationPayload = { title: string, body: string };
export type Messaging = {
  ping: () => Promise<any>;
  showNotification: (payload: NotificationPayload) => Promise<boolean>;
}

export interface IElectronAPI {
  isElectron: boolean;
  apiVersions: ApiVersions;
  messaging: Messaging;
};

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}