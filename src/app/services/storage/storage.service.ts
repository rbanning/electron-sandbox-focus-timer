import { castAs } from "@common/types";

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly store: Storage;  

  constructor() {
    this.store = localStorage;
  }

  //methods
  public get<T>(key: string) {
    const result = this.store.getItem(key);
    if (result) {
      try {
        return castAs<T>(JSON.parse(result));      
      } catch (error) {
        console.warn("StorageService was not able to parse the value stored", {result, error});
      }
    }
    //else
    return undefined;
  }

  public set(key: string, value: unknown) {
    if (typeof(value) === 'undefined') {
      this.remove(key);
    }
    else {
      this.store.setItem(key, JSON.stringify(value));
    }
  }

  public remove(key: string) {
    this.store.removeItem(key);
  }
}
