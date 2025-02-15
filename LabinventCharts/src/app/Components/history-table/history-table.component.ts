import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectFiles, setCurrentChartData } from '../../Redux';
import { RecentFiles } from '../../Interfaces';
import { FileSizePipe } from '../../Pipes/file-size.pipe';

@Component({
  selector: 'app-history-table',
  imports: [TableModule, CommonModule, FileSizePipe],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTableComponent {
  selectedFiles: RecentFiles | null = null;

  get fileStore$() {
    return this.store.select(selectFiles);
  }

  constructor(private store: Store) {}

  onRowSelect = () => {
    this.store.dispatch(
      setCurrentChartData({
        data: this.selectedFiles?.fileContent || [],
        selectedFile: this.selectedFiles,
      }),
    );
  };
}
