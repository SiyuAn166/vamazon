import React, { useEffect, useRef } from 'react';
import { sankeyLinkHorizontal, sankey, sankeyLeft } from "d3-sankey";
import * as d3 from 'd3';

import LineeChart from './LineeChart';
import dLine from '../data/LineChart.json'

const D3Sankey = ({ data }) => {
    const svgRef = useRef(null);
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 1000;
        const height = 400;
        svg
            // .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        const sankeyGenerator = sankey()
            .nodeId(d => d.name)
            .nodeAlign(sankeyLeft)
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 5], [width - 1, height - 5]]);

        const { nodes, links } = sankeyGenerator({
            nodes: data.nodes.map(d => Object.assign({}, d))
            , links: data.links.map(d => Object.assign({}, d))
        })
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        svg.append("g")
            .selectAll()
            .data(nodes)
            .join("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => color(d.category))
            .attr("stroke", d => color(d.category))
            .attr("stroke-width", 0)

        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.5)
            .selectAll()
            .data(links)
            .join("g")
            .style("mix-blend-mode", "multiply");

        link.append("path")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke", (d) => color(d.source.category))
            .attr("stroke-width", d => Math.max(1, d.width));

        svg.append("g")
            .selectAll()
            .data(nodes)
            .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(d => d.name);

    }, [data])

    return (
        <div>

            <div style={{ width: '90%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }} id='d3-sankey'>
                <svg ref={svgRef} width="90%" ></svg>
            </div>
            <div>
                <LineeChart data={dLine} />
            </div>
        </div>
    )
}
export default D3Sankey;