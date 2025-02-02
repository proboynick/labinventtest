import { Injectable } from '@angular/core';
import { RecentFiles } from '../Interfaces/RecentFiles';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileStoreService {
  // fileStore: RecentFiles[] = [];
  private _filesStore$ = new BehaviorSubject<RecentFiles[]>([]);
  fileStore$ = this._filesStore$.asObservable();

  get files() {
    return this._filesStore$.getValue();
  }

  pushFileToStore(file: RecentFiles) {
    this._filesStore$.next([file, ...this.files].slice(0, 5));
  }

  constructor() {}

  // getFiles(): Observable<RecentFiles[]> {
  //   return of([...this.fileStore]);
  // }

  // public pushFileToStore(file: RecentFiles): Observable<RecentFiles[]> {
  //   this.fileStore = [file, ...this.fileStore].slice(0, 5);
  //   console.log(this.fileStore);
  //   return of(this.fileStore);
  // }
}
