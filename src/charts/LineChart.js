import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data }) => {

    const svgRef = useRef();

    const width = 928;
    const height = 600;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 300;

    const lineData = Object.keys(data).reduce((output, category) => {
        return output.concat(
            Object.keys(data[category]).map(date => ({
                category,
                date,
                value: data[category][date]
            }))
        );
    }, []);

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        const x = d3.scaleUtc()
            .domain(d3.extent(lineData, d => d.date))
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(lineData, d => d.value)]).nice()
            .range([height - marginBottom, marginTop]);
        // X
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
        // Y
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove());


        const points = lineData.map((d) => [x(d.date), y(d.value), d.category]);
        const groups = d3.rollup(points, v => Object.assign(v, { z: v[0][2] }), d => d[2]);
        const line = d3.line();
        const path = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(groups.values())
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("d", line);

    }, [lineData]);
    return (
        <div style={{ width: '90%', position: 'relative' }} id='d3-line'>
            <svg ref={svgRef} width="90%" ></svg>
        </div>
    )
}

export default LineChart;