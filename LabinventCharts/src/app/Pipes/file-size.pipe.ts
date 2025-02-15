import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(fileSize: number): string {
    const k = 1024;
    const sizes = ['B', 'KiB', 'MiB'];
    const i = Math.floor(Math.log(fileSize) / Math.log(k));
    return `${(fileSize / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }
}
