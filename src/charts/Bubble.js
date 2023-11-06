import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
// import ColorPalette from './ColorPalette';

const D3BubbleChart = ({ data }) => {
    const width = 1000;
    const height = 600;
    const svgRef = useRef(null);
    const importAll = (requireContext) => requireContext.keys().map(requireContext);
    const ri = importAll(require.context('../img', false, /\.(png|jpe?g|svg)$/));
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.attr('height', height)
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const centralForce = d3.forceCenter(width / 2, height / 2);
        const simulation = d3.forceSimulation(data)
            .force("x", d3.forceX().strength(0.01))
            .force("y", d3.forceY().strength(0.01))
            .force('center', centralForce)
            .force('collide', d3.forceCollide().radius(d => d.value * 2.5).iterations(5))
            .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : 3))
            .alpha(1)
            .alphaTarget(0.3)
            .velocityDecay(0.1)
        const imageGroups = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g');

        imageGroups.append('image')
            .attr('xlink:href', d => ri[d.rating - 1])
            .attr('width', d => d.value * 5)
            .attr('height', d => d.value * 5)
            .attr('opacity', 1)
            .call(d3.drag()
                .on('start', onDragStart)
                .on('drag', onDrag)
                .on('end', onDragEnd))
            .on('mouseenter', onMouseEnter)
            .on('mouseleave', onMouseLeave);
        imageGroups.append('circle')
            .attr('r', d => d.value * 2.5)
            .attr('fill', d => color(d.group))
            .attr('opacity', 0.7)
            .call(d3.drag()
                .on('start', onDragStart)
                .on('drag', onDrag)
                .on('end', onDragEnd))
            .on('mouseenter', onMouseEnter)
            .on('mouseleave', onMouseLeave);


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
            .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

        legendItems
            .append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .attr('color', d => color(d))
            .style('fill', d => color(d))
            .on('click', (d) => {
                console.log(d.target.attributes.color.value)
            })
            
        legendItems
            .append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(d => d);

        function onMouseEnter(event, d) {
            const textElement = d3.select(event.target);
            const textBoundingBox = textElement.node().getBBox();
            const textX = textBoundingBox.x + textBoundingBox.width / 2;
            const textY = textBoundingBox.y + textBoundingBox.height / 2;
            const hoverOn = d3.select('#bubble')
                .append('div')
                .classed('hover-on', true)
                .style('position', 'absolute')
                .style('left', `${textX}px`)
                .style('top', `${textY - 200}px`);

            hoverOn.html(`
                        <p>Name: ${d.name}</p>
                        <p>Value: ${d.value}</p>
                        <p>Rating: ${d.rating}</p>
                        <p>Category: ${d.group}</p>
                        `);
            hoverOn.style('display', 'block');
        }

        function onMouseLeave() {
            d3.select('.hover-on').style('display', 'none').remove();
        }


        function onDragStart(event, d) {
            simulation.alpha(1).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function onDrag(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function onDragEnd(event, d) {
            d.fx = null;
            d.fy = null;
        }


        simulation.on('tick', () => {
            imageGroups.selectAll('image')
                .attr('x', d => d.x - d.value * 2.5)
                .attr('y', d => d.y - d.value * 2.5);
            imageGroups.select('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        })

    }, [data, ri]);

    return (
        <div style={{ width: '100%', position: 'relative' }} id='bubble'>
            <div id='legend-div'></div>
            <svg
                ref={svgRef}
                width="100%"
            ></svg>
        </div>
    );
};

export default D3BubbleChart;
