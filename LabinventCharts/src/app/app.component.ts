import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { HistoryTableComponent } from './Components/history-table/history-table.component';
import { FileInputFormComponent } from './Components/file-input-form/file-input-form.component';
import { ChartsComponent } from './Components/charts/charts.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HistoryTableComponent,
    FileInputFormComponent,
    ChartsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'LabinventCharts';
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
