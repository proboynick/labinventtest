import { createReducer, on } from '@ngrx/store';
import { RecentFiles } from '../Interfaces/RecentFiles';
import { pushFile } from './files-store.actions';

export interface FilesState {
  files: RecentFiles[];
}

const initialState: FilesState = {
  files: [],
};

export const filesReducer = createReducer(
  initialState,
  on(pushFile, (state, { file }): FilesState => {
    return { ...state, files: [file, ...state.files].slice(0, 5) };
  })
);
