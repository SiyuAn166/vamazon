import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ColorPalette = ({ numColors, onColorChange }) => {
    const paletteRef = useRef();

    const [selectedColor, setSelectedColor] = useState(d3.interpolateRainbow(0));

    useEffect(() => {
        const svg = d3.select(paletteRef.current);

        const colorScale = d3.scaleLinear()
            .domain([0, numColors - 1])
            .range([0, 1]);

        const gradient = d3.range(0, numColors).map((d) => d3.interpolateRainbow(colorScale(d)));

        svg.selectAll('*').remove();

        svg.append('defs')
            .append('linearGradient')
            .attr('id', 'colorGradient')
            .selectAll('stop')
            .data(gradient)
            .enter()
            .append('stop')
            .style('stop-color', (d) => d)
            .attr('offset', (d, i) => (i / (numColors - 1)) * 100 + '%');

        svg.append('rect')
            .attr('width', 400)
            .attr('height', 40)
            .style('fill', 'url(#colorGradient)')
            .on('mousemove', (event) => {
                const rect = paletteRef.current.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const index = Math.floor((x / rect.width) * (numColors - 1));
                const color = d3.interpolateRainbow(colorScale(index));
                setSelectedColor(color)
            })
            .on('click', () => {
                onColorChange(selectedColor);
            });

    }, [numColors, onColorChange, selectedColor]);

    return (
        <div>
            <svg ref={paletteRef} width={400} height={40} />
        </div>
    );
};

export default ColorPalette;
