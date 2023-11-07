import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function drawLegend(svg, color) {
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
        .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`)
        .on('mouseenter', (e, d) => {
            const nonHoveringImages = svg.selectAll("image")
                .filter(function () {
                    return this.getAttribute("grp") !== d;
                });
            const nonHoveringCircles = svg.selectAll("circle")
                .filter(function () {
                    return this.getAttribute("grp") !== d;
                });
            nonHoveringImages
                .transition()
                .duration(100)
                .attr('opacity', 0.02)
            nonHoveringCircles
                .transition()
                .duration(300)
                .attr('opacity', 0.02)
        })
        .on('mouseleave', (e, d) => {
            const nonHoveringImages = svg.selectAll("image")
                .filter(function () {
                    return this.getAttribute("grp") !== d;
                });

            const nonHoveringCircles = svg.selectAll("circle")
                .filter(function () {
                    return this.getAttribute("grp") !== d;
                });
            nonHoveringImages
                .transition()
                .duration(300)
                .attr('opacity', 1)
            nonHoveringCircles
                .transition()
                .duration(300)
                .attr('opacity', 0.7)
        })

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

}


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
            .attr('grp', d => d.group)
            .attr('xlink:href', d => ri[d.rating - 1])
            .attr('x', d => xScale(d.rating) - radius)
            .attr('y', d => yScale(d.value) - radius)
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .attr('opacity', 1)
        imageGroups.append('circle')
            .attr('grp', d => d.group)
            .attr('cx', d => xScale(d.rating))
            .attr('cy', d => yScale(d.value))
            .attr('r', radius)
            .attr('fill', d => color(d.group))
            .attr('opacity', 0.7)

        svg.append("defs")
            .append("filter")
            .attr("id", "image-shadow")
            .attr("width", "150%")
            .attr("height", "150%")
            .append("feDropShadow")
            .attr("dx", 2)
            .attr("dy", 2)
            .attr("stdDeviation", 3)
            .attr("flood-color", "rgba(0, 0, 0, 0.1)");
        svg.selectAll("image")
            .attr("filter", "url(#image-shadow)");

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