import { Component } from '@angular/core';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { RecentFiles } from '../../Interfaces/interface.RecentFiles';

@Component({
  selector: 'app-history-table',
  imports: [TableModule],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.less',
})
export class HistoryTableComponent {
  history: RecentFiles[] = [
    { fileName: 'File 1', fileSize: '3.2Mb', uploadDate: '01.02.2025' },
    { fileName: 'File 2', fileSize: '3.2Mb', uploadDate: '01.02.2025' },
    { fileName: 'File 3', fileSize: '3.2Mb', uploadDate: '01.02.2025' },
    { fileName: 'File 4', fileSize: '3.2Mb', uploadDate: '01.02.2025' },
    { fileName: 'File 5', fileSize: '3.2Mb', uploadDate: '01.02.2025' },
  ];
  selectedFiles: RecentFiles[] = [];

  onRowSelect = (event: TableRowSelectEvent) => {
    console.log(event, this.selectedFiles);
  };

  showSelectedfiles = () => {
    console.log(this.selectedFiles);
  };
}
