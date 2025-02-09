import * as d3 from 'd3';

export function createSvgElement(
  width: number,
  height: number
): d3.Selection<SVGSVGElement, undefined, null, undefined> {
  return d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('style', 'max-width: 100%; height: auto; user-select: none');
}
