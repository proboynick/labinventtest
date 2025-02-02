import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilesState } from './files-store.reducer';

export const selectFilesFeature =
  createFeatureSelector<FilesState>('FilesState');

export const selectFiles = createSelector(
  selectFilesFeature,
  (state: FilesState) => state.files
);
