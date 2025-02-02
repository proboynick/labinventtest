import { ValidData } from './ValidData';

export interface RecentFiles {
  fileName: string;
  fileSize: string;
  uploadDate: Date;
  fileContent: ValidData[];
}
