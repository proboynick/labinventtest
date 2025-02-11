import { createReducer, on } from '@ngrx/store';
import { RecentFiles } from '../Interfaces/RecentFiles';
import {
  pushFile,
  setCurrentChartData,
  setFirstSortLetter,
  setIsRemoveZeroValues,
  setLastSortLetter,
} from './files-store.actions';
import { ValidData } from '../Interfaces/ValidData';

export interface FilesState {
  files: RecentFiles[];
  selectedFile: RecentFiles | null;
  currentData: ValidData[];
  isRemoveZeroValues: boolean;
  firstSortLetter: string;
  lastSortLetter: string;
}

const initialState: FilesState = {
  files: [],
  selectedFile: null,
  currentData: [],
  isRemoveZeroValues: false,
  firstSortLetter: 'a',
  lastSortLetter: 'z',
};

function prepareData(
  enterData: ValidData[],
  isRemoveZeroValues: boolean,
  firstSortLetter: string,
  lastSortLetter: string,
): ValidData[] {
  let data: ValidData[] = [];

  if (isRemoveZeroValues) {
    data = enterData.filter((el) => el.value !== 0);
  } else {
    data = enterData;
  }
  return data.filter((el) => {
    const firstLetter = el.category.toLowerCase()[0];
    return firstLetter >= firstSortLetter && firstLetter <= lastSortLetter;
  });
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
        data,
        state.isRemoveZeroValues,
        state.firstSortLetter,
        state.lastSortLetter,
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
        state.firstSortLetter,
        state.lastSortLetter,
      ),
    };
  }),
  on(setFirstSortLetter, (state, { value }): FilesState => {
    return {
      ...state,
      firstSortLetter: value,
      currentData: prepareData(
        state.selectedFile?.fileContent as ValidData[],
        state.isRemoveZeroValues,
        value,
        state.lastSortLetter,
      ),
    };
  }),
  on(setLastSortLetter, (state, { value }): FilesState => {
    return {
      ...state,
      lastSortLetter: value,
      currentData: prepareData(
        state.selectedFile?.fileContent as ValidData[],
        state.isRemoveZeroValues,
        state.firstSortLetter,
        value,
      ),
    };
  }),
);
