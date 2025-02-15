import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RecentFiles } from '../../Interfaces/RecentFiles';
import { ValidData } from '../../Interfaces/ValidData';
import { Store } from '@ngrx/store';
import { pushFile } from '../../Redux';

@Component({
  selector: 'app-file-input-form',
  imports: [FileUploadModule, ButtonModule, CommonModule],
  templateUrl: './file-input-form.component.html',
  styleUrl: './file-input-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputFormComponent {
  private fileReader: FileReader = new FileReader();

  constructor(private store: Store) {}

  private validateFileContent = (fileContent: string): null | ValidData[] => {
    if (typeof fileContent !== 'string' || !fileContent.length) {
      return null;
    }
    const parsedData = JSON.parse(fileContent);
    if (!Array.isArray(parsedData)) {
      return null;
    }
    const validatedData: ValidData[] = [];
    parsedData.forEach((el: ValidData) => {
      if (typeof el !== 'object') return;
      if (!('category' in el) || !el.category) return;
      if (!('value' in el) || typeof el.value !== 'number' || el.value < 0)
        return;
      validatedData.push({ ...el, category: el.category.toString() });
    });
    return validatedData;
  };

  onUpload = (event: FileUploadHandlerEvent, form: FileUpload) => {
    const file = event.files[0];
    const fileDTO: RecentFiles = {
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date(),
      fileContent: [],
    };
    this.fileReader.readAsText(event.files[0]);
    this.fileReader.onload = () => {
      const dataArray = this.validateFileContent(
        this.fileReader.result as string,
      );
      if (!dataArray) {
        // leave console warning for future notification service
        console.warn('Wrong file data! File was not uploaded');
        return;
      }
      fileDTO.fileContent = dataArray;
      this.store.dispatch(pushFile({ file: fileDTO }));
    };
    form.clear();
  };
}
