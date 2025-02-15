import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { pushFile } from '../../Redux';
import { RecentFiles, ValidData } from '../../Interfaces';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-file-input-form',
  imports: [FileUploadModule, ButtonModule, CommonModule],
  templateUrl: './file-input-form.component.html',
  styleUrl: './file-input-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputFormComponent {
  private fileReader: FileReader = new FileReader();

  constructor(
    private store: Store,
    private msgService: MessageService,
  ) {}

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
    if (validatedData.length < parsedData.length) {
      this.showExtractDataWarn(parsedData.length - validatedData.length);
    }
    return validatedData;
  };

  private showErrorDataFormat() {
    this.msgService.add({
      severity: 'error',
      summary: 'Error ',
      detail: 'Wrong file data format! File was not uploaded.',
      life: 3000,
      closable: true,
    });
  }

  private showExtractDataWarn(removedElementsCount: number) {
    this.msgService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: `File has elements of incorrect data, ${removedElementsCount} elements was been removed!`,
      life: 3000,
      closable: true,
    });
  }

  private showSuccesfullMessage() {
    this.msgService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'File was added to store successfully!',
      life: 3000,
      closable: true,
    });
  }

  onUpload = (event: FileUploadHandlerEvent, form: FileUpload) => {
    const [file] = event.files;
    const fileDTO: RecentFiles = {
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date(),
      fileContent: [],
    };
    this.fileReader.readAsText(file);
    this.fileReader.onload = () => {
      const dataArray = this.validateFileContent(
        this.fileReader.result as string,
      );
      if (!dataArray) {
        this.showErrorDataFormat();
        return;
      }
      fileDTO.fileContent = dataArray;
      this.store.dispatch(pushFile({ file: fileDTO }));
    };
    this.showSuccesfullMessage();
    form.clear();
  };
}
