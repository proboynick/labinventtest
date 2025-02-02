import { Injectable } from '@angular/core';
import { RecentFiles } from '../Interfaces/RecentFiles';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileStoreService {
  private _filesStore$ = new BehaviorSubject<RecentFiles[]>([]);
  fileStore$ = this._filesStore$.asObservable();

  get files() {
    return this._filesStore$.getValue();
  }

  pushFileToStore(file: RecentFiles) {
    this._filesStore$.next([file, ...this.files].slice(0, 5));
  }

  constructor() {}
}
