export function appendMockTextToSvg(
  svg: d3.Selection<SVGSVGElement, undefined, null, undefined>,
) {
  svg
    .append('g')
    .attr('text-anchor', 'middle')
    .append('text')
    .text('No data for chart')
    .attr('font-size', '30px')
    .style('opacity', 0.4);
}
