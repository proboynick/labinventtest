import { createReducer, on } from '@ngrx/store';
import { RecentFiles } from '../Interfaces/RecentFiles';
import { pushFile, setCurrentChartData } from './files-store.actions';
import { ValidData } from '../Interfaces/ValidData';

export interface FilesState {
  files: RecentFiles[];
  currentData: ValidData[];
}

const initialState: FilesState = {
  files: [],
  currentData: [],
};

export const filesReducer = createReducer(
  initialState,
  on(pushFile, (state, { file }): FilesState => {
    return { ...state, files: [file, ...state.files].slice(0, 5) };
  }),
  on(setCurrentChartData, (state, { data }): FilesState => {
    return { ...state, currentData: data };
  })
);
