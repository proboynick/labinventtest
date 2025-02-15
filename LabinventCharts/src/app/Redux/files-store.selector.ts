import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilesState } from './files-store.reducer';

export const selectFeature = createFeatureSelector<FilesState>('FilesState');

export const selectFiles = createSelector(
  selectFeature,
  (state: FilesState) => state.files,
);

export const selectChartData = createSelector(
  selectFeature,
  (state: FilesState) => state.currentData,
);

export const selectSelectedFile = createSelector(
  selectFeature,
  (state: FilesState) => state.selectedFile,
);
