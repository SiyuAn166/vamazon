import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const colorMappings = {
  Category10: d3.schemeCategory10,
  Accent: d3.schemeAccent,
  Dark2: d3.schemeDark2,
  Paired: d3.schemePaired,
  Pastel1: d3.schemePastel1,
  Pastel2: d3.schemePastel2,
  Set1: d3.schemeSet1,
  Set2: d3.schemeSet2,
  Set3: d3.schemeSet3,
  Tableau10: d3.schemeTableau10,
};

const ColorSelector = ({ onSelect }) => {
  const [selectedColor, setSelectedColor] = useState('Category10');

  useEffect(() => {
    onSelect(colorMappings[selectedColor]);
  }, [selectedColor, onSelect]);

  const handleChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const colorSchemeOptions = Object.keys(colorMappings);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ padding:'0.5rem 1rem 0 1rem' }}>Color: </div>
        <select value={selectedColor} onChange={handleChange}>
          {/* <option value="">Select a color scheme</option> */}
          {colorSchemeOptions.map((scheme) => (
            <option key={scheme} value={scheme}>
              {scheme}
            </option>
          ))}
        </select>
      </div>
      <div>
        {selectedColor && (
          <div style={{ paddingLeft: '30px' }}>
            <svg
              viewBox={`0 0 ${colorMappings[selectedColor].length} 1`}
              style={{ display: 'block', width: `${colorMappings[selectedColor].length * 33}px`, height: '33px', margin: '0 -14px', cursor: 'pointer' }}
            >
              {colorMappings[selectedColor].map((c, i) => (
                <rect key={i} x={i} width={1} height={1} fill={c} />
              ))}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorSelector;
