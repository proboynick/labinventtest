import { ValidData } from './ValidData';

export interface RecentFiles {
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  fileContent: ValidData[];
}
