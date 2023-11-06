import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ColorPicker from './ColorPicker';

const Legend = ({ color }) => {
    const svgRef = useRef(null);

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    // const [selectedLegendItem, setSelectedLegendItem] = useState(null);

    useEffect(() => {


        const legend = d3.select(svgRef.current)
            .append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(20, 20)');
        const legendColors = color.domain();
        const legendRectSize = 18;
        const legendSpacing = 4;

        const handleLegendItemClick = (d) => {
            // setSelectedLegendItem(d);
            setSelectedColor(d.target.attributes.color.value);
            setShowColorPicker(true);
        };
        const legendItems = legend
            .selectAll('.legend-item')
            .data(legendColors)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .style('cursor', 'pointer')
            .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`)
            .on('click', handleLegendItemClick);

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

    const handleColorPickerChange = (newColor) => {
        // if (selectedLegendItem !== null) {
        //     // selectedLegendItem.color = newColor;
        //     setShowColorPicker(false);
        // }
    };

    return (
        <div>
            <svg ref={svgRef}></svg>
            {showColorPicker && (
                <ColorPicker color={selectedColor} onColorChange={handleColorPickerChange} />
            )}
        </div>

    )
}

export default Legend;