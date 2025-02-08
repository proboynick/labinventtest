import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { selectChartData } from '../../Redux/files-store.selector';
import { Subscription } from 'rxjs';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';

interface ChartData {
  category: string;
  value: number;
}

@Component({
  selector: 'app-charts',
  imports: [PieChartComponent, BarChartComponent],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsComponent {
  private storeDataSubscription: Subscription | null = null;

  data: ChartData[] = [];

  colorPalette: d3.ScaleOrdinal<string, unknown, never> | null = null;

  constructor(private store: Store, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.storeDataSubscription = this.store
      .select(selectChartData)
      .subscribe((storeData) => {
        const extData = storeData ? [...storeData] : [];
        this.colorPalette = this.generateColorPallette(extData);
        this.data = extData;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.storeDataSubscription?.unsubscribe();
  }

  private generateColorPallette(data: ChartData[]) {
    return d3
      .scaleOrdinal()
      .domain(data.map((d) => d.category))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.85 + 0.1), data.length)
          .reverse()
      );
  }
}
