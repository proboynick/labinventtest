import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FileStoreService } from '../../Services/file-store.service';
import { RecentFiles } from '../../Interfaces/RecentFiles';
import { ValidData } from '../../Interfaces/ValidData';

@Component({
  selector: 'app-file-input-form',
  imports: [FileUploadModule, ButtonModule, CommonModule],
  templateUrl: './file-input-form.component.html',
  styleUrl: './file-input-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputFormComponent {
  private fileReader: FileReader = new FileReader();
  uploadedFiles: File[] = [];

  constructor(private storeService: FileStoreService) {}

  private validateFileContent = (fileContent: string): null | ValidData[] => {
    if (typeof fileContent !== 'string' || !fileContent.length) {
      console.log('empty file');
      return null;
    }
    const parsedData = JSON.parse(fileContent);
    if (!Array.isArray(parsedData)) {
      return null;
    }
    const validatedData: ValidData[] = [];
    parsedData.forEach((el) => {
      if (typeof el !== 'object') return;
      if (!('category' in el) || !el.category) return;
      if (!('value' in el) || typeof el.value !== 'number') return;
      validatedData.push(el);
    });
    console.log(validatedData);
    return validatedData;
  };

  onUpload = (event: FileUploadHandlerEvent, form: FileUpload) => {
    const file = event.files[0];
    const fileDTO: RecentFiles = {
      fileName: file.name,
      fileSize: `${file.size}b`,
      uploadDate: new Date(),
      fileContent: [],
    };
    this.fileReader.readAsText(event.files[0]);
    this.fileReader.onload = () => {
      const dataArray = this.validateFileContent(
        this.fileReader.result as string
      );
      if (!dataArray) {
        // leave console warning for future notification service
        console.warn('Wrong file data! File was not uploaded');
        return;
      }
      fileDTO.fileContent = dataArray;
      this.storeService.pushFileToStore(fileDTO);
    };
    form.clear();
  };
}
