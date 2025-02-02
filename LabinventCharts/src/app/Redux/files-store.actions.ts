import { createAction, props } from '@ngrx/store';
import { RecentFiles } from '../Interfaces/RecentFiles';

export const pushFile = createAction(
  '[FilesState] Push file',
  props<{ file: RecentFiles }>()
);
