import { Component } from '@angular/core';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-input-form',
  imports: [FileUploadModule, ButtonModule, CommonModule],
  templateUrl: './file-input-form.component.html',
  styleUrl: './file-input-form.component.less',
})
export class FileInputFormComponent {
  fileReader: FileReader = new FileReader();
  uploadedFiles: File[] = [];
  onUpload = (event: any) => {
    console.log(event);
  };
  showFiles = (event: FileSelectEvent) => {
    this.fileReader.readAsText(event.currentFiles[0]);
    this.fileReader.onload = () => console.log(this.fileReader.result);
  };
}
