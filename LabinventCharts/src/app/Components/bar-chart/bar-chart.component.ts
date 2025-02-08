import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { ValidData } from '../../Interfaces/ValidData';
import { appendMockTextToSvg } from '../../Utils';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  @ViewChild('barChart', { static: true, read: ElementRef })
  barChart: ElementRef | null = null;

  @Input() data: ValidData[] = [];
  @Input() colorPalette: d3.ScaleOrdinal<string, unknown, never> | null = null;

  private width = 640;
  private height = 640;

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

  constructor() {}

  ngAfterViewInit() {
    this.barChart?.nativeElement.append(this.barSvg.node());
  }

  ngOnChanges() {
    this.renderBarChart();
  }

  private createHorizontalScale(
    marginLeft: number,
    marginRight: number
  ): d3.ScaleBand<string> {
    return d3
      .scaleBand()
      .domain(this.data.map((d) => d.category))
      .range([marginLeft, this.width - marginRight])
      .padding(0.1);
  }

  private createVerticalScale(
    marginBottom: number,
    marginTop: number
  ): d3.ScaleLinear<number, number, never> {
    return d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d: ValidData) => d.value) as number])
      .nice()
      .range([this.height - marginBottom, marginTop]);
  }

  private drawBars(
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleLinear<number, number, never>
  ): void {
    this.barSvg
      .attr('viewBox', [0, 0, this.width, this.height])
      .append('g')
      .selectAll()
      .data(this.data)
      .join('rect')
      .attr('fill', (d) =>
        this.colorPalette ? (this.colorPalette(d.category) as string) : 'red'
      )
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

  private renderBarChart() {
    const marginTop = 30;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    this.barSvg.selectAll('g').remove();
    if (!this.data.length || !this.colorPalette) {
      appendMockTextToSvg(this.barSvg);
      return;
    }

    const xScale = this.createHorizontalScale(marginLeft, marginRight);
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(5);
    const yScale = this.createVerticalScale(marginBottom, marginTop);
    const yAxis = d3.axisLeft(yScale).tickSize(5);

    this.drawBars(xScale, yScale);
    this.drawHorizontalAxis(xAxis, marginBottom, xScale.bandwidth());
    this.drawVerticalAxis(yAxis, marginLeft);
  }
}
