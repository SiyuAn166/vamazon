import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import drawLegend from './legend.js'

const XYBubble = ({ data }) => {
    const svgRef = useRef(null);
    const nodes = data.nodes;



    useEffect(() => {
        const width = 1000;
        const height = 600;

        const svg = d3.select(svgRef.current);
        svg.attr('height', height)


        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const offset = 250
        var xScale = d3.scaleLinear()
            .domain([0, d3.max(nodes, d => d.rating) + 1])
            .range([offset, offset + width]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(nodes, d => d.value) + 5])
            .range([height - 50, 0]);

        svg.append('g')
            .attr('transform', `translate(0, ${height - 50})`)
            .call(d3.axisBottom(xScale))
            .call(g => g.append("text")
                .attr("x", offset + width / 2)
                .attr("y", 40)
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .attr('font-size', 16)
                .attr("fill", "currentColor")
                .text("Rating"));

        svg.append('g')
            .attr('transform', `translate(${offset}, 0)`)
            .call(d3.axisLeft(yScale))
            .call(g => g.append("text")
                .attr("x", -40)
                .attr("y", height / 2)
                .attr("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr('font-size', 16)
                .attr("fill", "currentColor")
                .attr("writing-mode", "vertical-lr")
                .text("Number of reviews"));

        const importAll = (requireContext) => requireContext.keys().map(requireContext);
        const ri = importAll(require.context('../img', false, /\.(png|jpe?g|svg)$/));

        const radius = 35;
        const imageGroups = svg.selectAll('xy-image')
            .data(nodes)
            .enter()
            .append('g');
        imageGroups.append('image')
            .attr('xlink:href', d => ri[d.rating - 1])
            .attr('x', d => xScale(d.rating) - radius)
            .attr('y', d => yScale(d.value) - radius)
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('opacity', 1)
        imageGroups.append('circle')
            .attr('cx', d => xScale(d.rating))
            .attr('cy', d => yScale(d.value))
            .attr('r', radius)
            .attr('fill', d => color(d.group))
            .attr('opacity', 0.7)

        drawLegend(svg, color);

    }, [nodes])

    return (
        <div style={{ width: '100%', position: 'relative' }} id='xy-bubble'>
            <svg ref={svgRef} width="100%">
            </svg>
        </div>
    )
}

export default XYBubble;