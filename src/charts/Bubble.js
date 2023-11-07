import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


const importAll = (requireContext) => requireContext.keys().map(requireContext);
const ri = importAll(require.context('../img', false, /\.(png|jpe?g|svg)$/));

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
                .attr('opacity', 0.1)
            nonHoveringCircles
                .transition()
                .duration(300)
                .attr('opacity', 0.1)

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
        });

    legendItems
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('color', d => color(d))
        .style('fill', d => color(d))
        .on('click', (d) => {

        });

    legendItems
        .append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(d => d);

    const emoji = svg
        .append('g')
        .attr('class', 'emoji-face')
        .attr('transform', 'translate(20, 150)');

    const emojiItems = emoji.selectAll('.legend-emoji-face')
        .data(ri)
        .enter()
        .append('g')
        .attr('class', 'legend-emoji-face-item')
        .attr('cursor', 'pointer')
        .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`)

    emojiItems.append('image')
        .attr('class', 'legend-emoji-face-img')
        .attr('xlink:href', d => d)
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('opacity', 1)
    
        emojiItems
        .append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text((d, i) => `Rating = ${i+1}`);

}

const D3BubbleChart = ({ data }) => {
    const width = 1000;
    const height = 600;
    const svgRef = useRef(null);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const nodes = data.nodes;
    const links = data.links;

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.attr('height', height)
        const centralForce = d3.forceCenter(width / 2, height / 2);
        const simulation = d3.forceSimulation(nodes)
            .force("x", d3.forceX().strength(0.01))
            .force("y", d3.forceY().strength(0.01))
            .force('center', centralForce)
            // .force("link", d3.forceLink(links).id(d => d.name))
            .force('collide', d3.forceCollide().radius(d => d.value * 2.5).iterations(5))
            .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : 3))
            .alpha(1)
            .alphaTarget(0.3)
            .velocityDecay(0.1)

        const drawBubbles = (svg, simulation, nodes) => {
            const imageGroups = svg.selectAll('g')
                .data(nodes)
                .enter()
                .append('g');

            imageGroups.append('image')
                .attr('xlink:href', d => ri[d.rating - 1])
                .attr('bubble-item', true)
                .attr('width', d => d.value * 5)
                .attr('height', d => d.value * 5)
                .attr('opacity', 1)
                .attr('grp', d => d.group)
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
                .attr('grp', d => d.group)
                .call(d3.drag()
                    .on('start', onDragStart)
                    .on('drag', onDrag)
                    .on('end', onDragEnd))
                .on('mouseenter', onMouseEnter)
                .on('mouseleave', onMouseLeave);

            svg.append("defs")
                .append("filter")
                .attr("id", "image-shadow")
                .attr("width", "150%")
                .attr("height", "150%")
                .append("feDropShadow")
                .attr("dx", 2)
                .attr("dy", 2)
                .attr("stdDeviation", 3)
                .attr("flood-color", "rgba(0, 0, 0, 0.8)");
            svg.selectAll("image[bubble-item]")
                .attr("filter", "url(#image-shadow)");

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
                    .style('top', `${textY - 200}px`)
                    .style('opacity', 0)
                    .style('display', 'block')
                    .style('background-color', 'black')
                    .style('border-radius', '15px')
                    .style('padding', '10px')
                    .style('color', 'white')
                    .html(`
                        <p>Name: ${d.name}</p>
                        <p>Value: ${d.value}</p>
                        <p>Rating: ${d.rating}</p>
                        <p>Category: ${d.group}</p>
                        `);
                hoverOn
                    .transition().duration(300)
                    .style('opacity', 1)

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

            return imageGroups;
        }

        let imageGroups = drawBubbles(svg, simulation, nodes);

        drawLegend(svg, color);

        simulation.on('tick', () => {
            imageGroups.selectAll('image')
                .attr('x', d => d.x - d.value * 2.5)
                .attr('y', d => d.y - d.value * 2.5);
            imageGroups.select('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        })

    }, [nodes, links, color]);

    return (
        <div style={{ width: '100%', position: 'relative' }} id='bubble'>
            <svg ref={svgRef} width="100%">
            </svg>
        </div>
    );
};

export default D3BubbleChart;
