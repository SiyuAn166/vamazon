import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import drawLegend from './legend.js'

const BubbleText = ({ data }) => {
    const svgRef = useRef();

    const width = 1000;
    const height = 600;
    const color = d3.scaleOrdinal(d3.schemeCategory10);


    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.attr('height', height)

        const centralForce = d3.forceCenter(width / 2, height / 2);
        const simulation = d3.forceSimulation(data)
            .force("x", d3.forceX().strength(0.01))
            .force("y", d3.forceY().strength(0.01))
            .force('center', centralForce)
            .force('collide', d3.forceCollide().radius(d => d.value * 3.6).iterations(5))
            .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : 3))
            .alpha(1)
            .alphaTarget(0.3)
            .velocityDecay(0.1)

        const textGroups = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g');

        textGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .style('font-size', d => `${d.value * 1.5}px`)
            .style('fill', d => color(d.group))
            .style('cursor', 'pointer')
            .text(d => d.text)
            .call(d3.drag()
                .on('start', onDragStart)
                .on('drag', onDrag)
                .on('end', onDragEnd))
            .on('mouseenter', onMouseEnter)
            .on('mouseleave', onMouseLeave);

        drawLegend(svg, color);

        function onMouseEnter(event, d) {

            const textElement = d3.select(event.target);
            const textBoundingBox = textElement.node().getBBox();
            const textX = textBoundingBox.x + textBoundingBox.width / 2;
            const textY = textBoundingBox.y + textBoundingBox.height / 2;
            const hoverOnContainer = d3.select('#bubble-text');
            const hoverOn = hoverOnContainer
                .append('div')
                .classed('hover-on', true)
                .style('position', 'absolute')
                .style('left', `${textX}px`)
                .style('top', `${textY - 200}px`);

            hoverOn.html(`
                    <p>Name: ${d.name}</p>
                    <p>Review: ${d.text}</p>
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
            textGroups.selectAll('text')
                .attr('x', d => d.x)
                .attr('y', d => d.y);

        })
    }, [data, color]);




    return (
        
        <div style={{ width: '100%', position: 'relative'}} id='bubble-text'>
            <svg
                ref={svgRef}
                width="100%"
            ></svg>
        </div>
    );
}

export default BubbleText;