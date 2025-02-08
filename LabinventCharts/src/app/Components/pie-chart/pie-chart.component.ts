import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { ValidData } from '../../Interfaces/ValidData';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { appendMockTextToSvg } from '../../Utils';

@Component({
  selector: 'app-pie-chart',
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent implements OnChanges {
  @ViewChild('pieChart', { static: true, read: ElementRef })
  pieChart: ElementRef | null = null;

  @Input() data: ValidData[] = [];
  @Input() colorPalette: d3.ScaleOrdinal<string, unknown, never> | null = null;

  private width = 640;
  private height = 640;
  private radius = 300;

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

  private pie = d3
    .pie<ValidData>()
    .value(function (d: any) {
      return d.value;
    })
    .sort(null); //disable preset sort

  private arcGenerator = d3.arc();

  constructor() {}

  ngAfterViewInit() {
    this.pieChart?.nativeElement.append(this.pieSvg.node());
  }

  ngOnChanges() {
    this.renderPieChart();
  }

  private appendSectionTitles() {
    this.pieSvg
      .selectAll('path')
      .append('title')
      .text((d: any) => `Category: ${d.data.category}\nValue: ${d.data.value}`);
  }

  private drawArcs(data: d3.PieArcDatum<ValidData>[]) {
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
      .attr('fill', (d) =>
        this.colorPalette
          ? (this.colorPalette(d.data.category) as string)
          : 'red'
      )
      .attr('stroke', '#ffffff')
      .style('stroke-width', '0.5px')
      .style('opacity', 1);
    this.appendLabels(data);
  }

  private convertArcToPercents(startAngle: number, endAngle: number): string {
    return ((100 * (endAngle - startAngle)) / (2 * Math.PI)).toFixed(1) + '%';
  }

  private appendLabels(data: d3.PieArcDatum<ValidData>[]) {
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
          .attr('font-size', '13px')
          .attr('fill-opacity', 0.4)
          .text((d) => this.convertArcToPercents(d.startAngle, d.endAngle))
      );
  }

  private renderPieChart() {
    this.pieSvg.selectAll('g').remove();
    if (!this.data.length || !this.colorPalette) {
      appendMockTextToSvg(this.pieSvg);
      return;
    }
    const data_ready = this.pie(this.data);
    this.drawArcs(data_ready);
    this.appendSectionTitles();
  }
}
