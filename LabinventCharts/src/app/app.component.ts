import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { HistoryTableComponent } from './Components/history-table/history-table.component';
import { FileInputFormComponent } from './Components/file-input-form/file-input-form.component';
import { ChartsComponent } from './Components/charts/charts.component';
import { ToolsComponent } from './Components/tools/tools.component';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [
    HistoryTableComponent,
    FileInputFormComponent,
    ChartsComponent,
    ToolsComponent,
    Toast,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  title = 'LabinventCharts';
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
