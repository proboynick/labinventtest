import { createReducer, on } from '@ngrx/store';
import { RecentFiles } from '../Interfaces/RecentFiles';
import {
  pushFile,
  setCurrentChartData,
  setIsRemoveZeroValues,
} from './files-store.actions';
import { ValidData } from '../Interfaces/ValidData';

export interface FilesState {
  files: RecentFiles[];
  selectedFile: RecentFiles | null;
  currentData: ValidData[];
  isRemoveZeroValues: boolean;
}

const initialState: FilesState = {
  files: [],
  selectedFile: null,
  currentData: [],
  isRemoveZeroValues: false,
};

function prepareData(
  enterData: ValidData[],
  isRemoveZeroValues: boolean,
): ValidData[] {
  const data = [...enterData];

  if (isRemoveZeroValues) {
    return data.filter((el) => el.value !== 0);
  }
  return data;
}

export const filesReducer = createReducer(
  initialState,
  on(pushFile, (state, { file }): FilesState => {
    return { ...state, files: [file, ...state.files].slice(0, 5) };
  }),
  on(setCurrentChartData, (state, { data, selectedFile }): FilesState => {
    return {
      ...state,
      currentData: prepareData(
        selectedFile?.fileContent as ValidData[],
        state.isRemoveZeroValues,
      ),
      selectedFile,
    };
  }),
  on(setIsRemoveZeroValues, (state, { value }): FilesState => {
    return {
      ...state,
      isRemoveZeroValues: value,
      currentData: prepareData(
        state.selectedFile?.fileContent as ValidData[],
        value,
      ),
    };
  }),
);
