import { createReducer, on } from '@ngrx/store';
import { RecentFiles } from '../Interfaces/RecentFiles';
import {
  pushFile,
  setCurrentChartData,
  setFilterLetter,
  setIsRemoveZeroValues,
} from './files-store.actions';
import { ValidData } from '../Interfaces/ValidData';

export interface FilesState {
  files: RecentFiles[];
  selectedFile: RecentFiles | null;
  currentData: ValidData[];
  isRemoveZeroValues: boolean;
  filterLetter: string;
}

const initialState: FilesState = {
  files: [],
  selectedFile: null,
  currentData: [],
  isRemoveZeroValues: false,
  filterLetter: '',
};

function prepareData(
  enterData: ValidData[],
  isRemoveZeroValues: boolean,
  firstSortLetter: string,
): ValidData[] {
  if (!isRemoveZeroValues && !firstSortLetter) {
    return enterData;
  }
  let data: ValidData[] = [];

  if (isRemoveZeroValues) {
    const minValue = Math.min(...enterData.map<number>((el) => el.value));
    data = enterData.filter((el) => el.value !== minValue);
  } else {
    data = enterData;
  }
  return data.filter((el) => {
    return el.category.toLowerCase().startsWith(firstSortLetter);
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
        state.filterLetter,
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
        state.filterLetter,
      ),
    };
  }),
  on(setFilterLetter, (state, { value }): FilesState => {
    return {
      ...state,
      filterLetter: value,
      currentData: prepareData(
        state.selectedFile?.fileContent as ValidData[],
        state.isRemoveZeroValues,
        value,
      ),
    };
  }),
);
