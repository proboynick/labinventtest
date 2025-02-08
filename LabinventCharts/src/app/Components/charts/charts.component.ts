import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as d3 from 'd3';
import { selectChartData } from '../../Redux/files-store.selector';
import { Subscription } from 'rxjs';

interface ChartData {
  category: string;
  value: number;
}

@Component({
  selector: 'app-charts',
  imports: [],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsComponent {
  @ViewChild('pieChart', { static: true, read: ElementRef })
  pieChart: ElementRef | null = null;
  @ViewChild('barChart', { static: true, read: ElementRef })
  barChart: ElementRef | null = null;

  private storeDataSubscription: Subscription | null = null;

  private width = 640;
  private height = 640;
  private radius = 300;

  private arcGenerator = d3.arc();

  private pieSvg: d3.Selection<SVGSVGElement, undefined, null, undefined> = d3
    .create('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr('viewBox', [
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    ])
    .attr('style', 'max-width: 100%; height: auto; user-select: none');

  private barSvg: d3.Selection<SVGSVGElement, undefined, null, undefined> = d3
    .create('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr('viewBox', [
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    ])
    .attr('style', 'max-width: 100%; height: auto; user-select: none');

  private pie = d3
    .pie<ChartData>()
    .value(function (d: any) {
      return d.value;
    })
    .sort(null); //disable preset sort

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

  private appendSectionTitles() {
    this.pieSvg
      .selectAll('path')
      .append('title')
      .text((d: any) => `Category: ${d.data.category}\nValue: ${d.data.value}`);
  }

  private drawArcs(
    data: d3.PieArcDatum<ChartData>[],
    colorPalette: d3.ScaleOrdinal<string, unknown, never>
  ) {
    this.pieSvg
      .append('g')
      .selectAll()
      .data(data)
      .join('path')
      .attr('d', (d) => {
        return this.arcGenerator({
          innerRadius: this.radius * 0,
          outerRadius: this.radius,
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          padAngle: 0,
        });
      })
      .attr('fill', (d) => colorPalette(d.data.category) as string)
      .attr('stroke', '#ffffff')
      .style('stroke-width', '0.5px')
      .style('opacity', 1);
    this.appendLabels(data);
  }

  private appendMockText(
    svg: d3.Selection<SVGSVGElement, undefined, null, undefined>
  ) {
    svg
      .append('g')
      .attr('text-anchor', 'middle')
      .append('text')
      .text('No data for chart')
      .attr('font-size', '30px')
      .style('opacity', 0.4);
  }

  private convertArcToPercents(startAngle: number, endAngle: number): string {
    return ((100 * (endAngle - startAngle)) / (2 * Math.PI)).toFixed(1) + '%';
  }

  private appendLabels(data: d3.PieArcDatum<ChartData>[]) {
    const arcLabel = d3
      .arc()
      .innerRadius(this.radius * 0.7)
      .outerRadius(this.radius * 1)
      .padAngle(0.007);

    this.pieSvg
      .append('g')
      .attr('text-anchor', 'middle')
      .selectAll()
      .data(data)
      .join('text')
      .attr(
        'transform',
        (d) =>
          `translate(${arcLabel.centroid(d as unknown as d3.DefaultArcObject)})`
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.15)
          .append('tspan')
          .attr('font-size', (d) => `16px`)
          .attr('font-weight', 'bold')
          .attr('fill-opacity', 0.5)
          .text((d) => d.data.category)
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.2)
          .append('tspan')
          .attr('x', 0)
          .attr('y', '1em')
          .attr('font-size', (d) => `13px`)
          .attr('fill-opacity', 0.4)
          .text((d) => this.convertArcToPercents(d.startAngle, d.endAngle))
      );
  }

  private renderPieChart(data: ChartData[]) {
    this.pieSvg.selectAll('g').remove();
    if (!data.length) {
      this.appendMockText(this.pieSvg);
      return;
    }
    const colorPalette = this.generateColorPallette(data);
    const data_ready = this.pie(data);
    this.drawArcs(data_ready, colorPalette);
    this.appendSectionTitles();
  }

  private createHorizontalScale(
    data: ChartData[],
    marginLeft: number,
    marginRight: number
  ): d3.ScaleBand<string> {
    return d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([marginLeft, this.width - marginRight])
      .padding(0.1);
  }

  private createVerticalScale(
    data: ChartData[],
    marginBottom: number,
    marginTop: number
  ): d3.ScaleLinear<number, number, never> {
    return d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.value) as number])
      .nice()
      .range([this.height - marginBottom, marginTop]);
  }

  private drawBars(
    data: ChartData[],
    palette: d3.ScaleOrdinal<string, unknown, never>,
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleLinear<number, number, never>
  ): void {
    this.barSvg
      .attr('viewBox', [0, 0, this.width, this.height])
      .append('g')
      .selectAll()
      .data(data)
      .join('rect')
      .attr('fill', (d) => palette(d.category) as string)
      .attr('x', (d) => xScale(d.category) as number)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => yScale(0) - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .append('title')
      .text((d) => `Category: ${d.category};\nValue: ${d.value}`);
  }

  private drawHorizontalAxis(
    xAxis: d3.Axis<string>,
    marginBottom: number,
    bandwidth: number
  ) {
    this.barSvg
      .append('g')
      .attr('transform', `translate(0,${this.height - marginBottom})`)
      .call(xAxis)
      .attr('font-size', bandwidth < 16 ? '8px' : '14px');
  }

  private drawVerticalAxis(yAxis: d3.Axis<d3.NumberValue>, marginLeft: number) {
    this.barSvg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(yAxis)
      .attr('font-size', '14px');
  }

  private renderBarChart(data: ChartData[]) {
    const marginTop = 30;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    this.barSvg.selectAll('g').remove();
    if (!data.length) {
      this.appendMockText(this.barSvg);
      return;
    }

    const xScale = this.createHorizontalScale(data, marginLeft, marginRight);
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(5);
    const yScale = this.createVerticalScale(data, marginBottom, marginTop);
    const yAxis = d3.axisLeft(yScale).tickSize(5);

    const colors = this.generateColorPallette(data);

    this.drawBars(data, colors, xScale, yScale);
    this.drawHorizontalAxis(xAxis, marginBottom, xScale.bandwidth());
    this.drawVerticalAxis(yAxis, marginLeft);
  }

  constructor(private store: Store) {}

  ngOnInit() {
    this.pieChart?.nativeElement.append(this.pieSvg.node());
    this.barChart?.nativeElement.append(this.barSvg.node());
    this.storeDataSubscription = this.store
      .select(selectChartData)
      .subscribe((storeData) => {
        const extData = storeData ? [...storeData] : [];
        this.renderPieChart(extData);
        this.renderBarChart(extData);
      });
  }

  ngOnDestroy() {
    this.storeDataSubscription?.unsubscribe();
  }
}
