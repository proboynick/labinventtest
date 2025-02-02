import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { RecentFiles } from '../../Interfaces/RecentFiles';
import { FileStoreService } from '../../Services/file-store.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectFiles } from '../../Redux/files-store.selector';

@Component({
  selector: 'app-history-table',
  imports: [TableModule, CommonModule],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTableComponent {
  selectedFiles: RecentFiles[] = [];

  get fileStore$() {
    return this.store.select(selectFiles);
  }

  constructor(private store: Store) {}

  onRowSelect = (event: TableRowSelectEvent) => {
    console.log(event, this.selectedFiles);
  };

  showSelectedfiles = () => {
    console.log(this.selectedFiles);
  };
}
