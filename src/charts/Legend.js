import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Legend = ({ color }) => {
    const svgRef = useRef(null);

    useEffect(() => {


        const legend = d3.select(svgRef.current)
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
            .style('cursor', 'pointer')
            .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`)
            .on('click', (d) => {});

        legendItems
            .append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', d => color(d))
            .attr('color', d => color(d));


        legendItems
            .append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .attr('color', d => color(d))
            .text(d => d);


    }, [color]);

    return (
            <svg ref={svgRef}></svg>
    )
}

export default Legend;