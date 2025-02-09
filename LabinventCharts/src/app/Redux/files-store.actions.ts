import { createAction, props } from '@ngrx/store';
import { RecentFiles } from '../Interfaces/RecentFiles';
import { ValidData } from '../Interfaces/ValidData';

export const pushFile = createAction(
  '[FilesState] Push file',
  props<{ file: RecentFiles }>(),
);

export const setCurrentChartData = createAction(
  '[FileState] Set Current Chart Data',
  props<{ data: ValidData[] }>(),
);
