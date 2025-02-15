import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { appendMockTextToSvg, createSvgElement } from '../../Utils';
import {
  BAR_PADDING_COEF,
  CHART_HEIGHT_PX,
  CHART_WIDTH_PX,
  MARGIN_BOTTOM_PX,
  MARGIN_LEFT_PX,
  MARGIN_RIGHT_PX,
  MARGIN_TOP_PX,
} from '../../Constants';
import { ValidData } from '../../Interfaces';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('barChart', { static: true, read: ElementRef })
  barChart: ElementRef | null = null;

  @Input() data: ValidData[] = [];
  @Input() colorPalette: d3.ScaleOrdinal<string, unknown, never> | null = null;

  private barSvg: d3.Selection<SVGSVGElement, undefined, null, undefined> =
    createSvgElement(CHART_WIDTH_PX, CHART_HEIGHT_PX);

  ngAfterViewInit() {
    this.barChart?.nativeElement.append(this.barSvg.node());
  }

  ngOnChanges() {
    this.renderBarChart(
      MARGIN_TOP_PX,
      MARGIN_RIGHT_PX,
      MARGIN_BOTTOM_PX,
      MARGIN_LEFT_PX,
    );
  }

  private createHorizontalScale(
    width: number,
    marginLeft: number,
    marginRight: number,
  ): d3.ScaleBand<string> {
    return d3
      .scaleBand()
      .domain(this.data.map((d) => d.category))
      .range([marginLeft, width - marginRight])
      .padding(BAR_PADDING_COEF);
  }

  private createVerticalScale(
    height: number,
    marginBottom: number,
    marginTop: number,
  ): d3.ScaleLinear<number, number, never> {
    return d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d: ValidData) => d.value) as number])
      .nice()
      .range([height - marginBottom, marginTop]);
  }

  private drawBars(
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleLinear<number, number, never>,
  ): void {
    this.barSvg
      .attr('viewBox', [0, 0, CHART_WIDTH_PX, CHART_HEIGHT_PX])
      .append('g')
      .selectAll()
      .data(this.data)
      .join('rect')
      .attr('fill', (d) =>
        this.colorPalette ? (this.colorPalette(d.category) as string) : 'red',
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
    minY: number,
    height: number,
    marginBottom: number,
  ) {
    this.barSvg
      .append('g')
      .attr('transform', `translate(${minY},${height - marginBottom})`)
      .call(xAxis)
      .attr('font-size', '12px');
  }

  private drawVerticalAxis(
    yAxis: d3.Axis<d3.NumberValue>,
    minX: number,
    marginLeft: number,
  ) {
    this.barSvg
      .append('g')
      .attr('transform', `translate(${marginLeft},${minX})`)
      .call(yAxis)
      .attr('font-size', '14px');
  }

  private renderBarChart(
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
  ) {
    this.barSvg.selectAll('g').remove();
    if (!this.data.length || !this.colorPalette) {
      appendMockTextToSvg(this.barSvg);
      return;
    }

    const xScale = this.createHorizontalScale(
      CHART_WIDTH_PX,
      marginLeft,
      marginRight,
    );
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(5);
    const yScale = this.createVerticalScale(
      CHART_HEIGHT_PX,
      marginBottom,
      marginTop,
    );
    const yAxis = d3.axisLeft(yScale).tickSize(5);

    this.drawBars(xScale, yScale);
    this.drawHorizontalAxis(xAxis, 0, CHART_HEIGHT_PX, marginBottom);
    this.drawVerticalAxis(yAxis, 0, marginLeft);
  }
}
