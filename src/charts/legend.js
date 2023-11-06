const drawLegend = (svg, color) => {
    const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(20, 20)');

    const legendColors = color.domain();
    const legendRectSize = 18;
    const legendSpacing = 4;
    const legendItems = legend
        .selectAll('.legend-item')
        .data(legendColors)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('cursor', 'pointer')
        .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

    legendItems
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('color', d => color(d))
        .style('fill', d => color(d))
        .on('click', (d) => {

        })

    legendItems
        .append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(d => d);

    return legendItems;
}

export default drawLegend;