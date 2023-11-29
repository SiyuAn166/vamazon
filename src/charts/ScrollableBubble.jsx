import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ColorSelector from './ColorSelector';


const importAll = (requireContext) => requireContext.keys().map(requireContext);
const ri = importAll(require.context('../img', false, /\.(png|jpe?g|svg)$/));

const drawLegend = (svg, color) => {
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
    .attr('opacity', 1)
    .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`)
    .on('mouseenter', (e, d) => {
      const nonHoveringImages = svg.selectAll("image[bubble-item]")
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
      const nonHoveringImages = svg.selectAll("image[bubble-item]")
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
    .on('click', (e, d) => {
      const hoveringImages = svg.selectAll("image[bubble-item]")
        .filter(function () {
          return this.getAttribute("grp") === d;
        });
      const hoveringCircles = svg.selectAll("circle")
        .filter(function () {
          return this.getAttribute("grp") === d;
        });

      hoveringImages.style("display", function () {
        return this.style.display === "none" ? "block" : "none";
      });

      hoveringCircles.style("display", function () {
        return this.style.display === "none" ? "block" : "none";
      });

      const legIt = d3.select(e.currentTarget);
      let op = legIt.attr('opacity');
      legIt.attr('opacity', op === '1' ? '0.1' : '1');
    })

  legendItems
    .append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .attr('color', d => color(d))
    .style('fill', d => color(d))
    .on('click', (e, d) => {
      // console.log(e)

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
    .text((d, i) => `Rating = ${i + 1}`);

}

const ToggleButton = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);
const ScrollableBubbleChart = ({ data }) => {
  const width = 1000;
  const height = 600;
  const svgRef = useRef(null);
  const [xyBubble, setXYBubble] = useState(false);

  const nodes = data.nodes;
  const links = data.links;

  const [colorScheme, setColorScheme] = useState(d3.schemeCategory10);
  const getColor = (colorSc) => {
    setColorScheme(colorSc);
  };

  const handleScroll = (event) => {
    const deltaY = event.deltaY;

    if (Math.abs(deltaY) > 1) {
      setXYBubble(true);
    }
  }
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.attr('height', height);
    svg.on('wheel', handleScroll);

    let color = d3.scaleOrdinal(colorScheme);
    const centralForce = d3.forceCenter(width / 2, height / 2);
    const simulation = d3.forceSimulation(nodes)
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force('center', centralForce)
      // .force("link", d3.forceLink(links).id(d => d.name))
      .force('collide', d3.forceCollide().radius(d => d.value * 2.5).iterations(5))
      .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : 3))
      .alpha(0.6)
      .alphaTarget(0.3)
      .velocityDecay(0.1)

    const transitionToXYBubble = (svg, color) => {

      const offset = 250;

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

      const radius = 35;


      svg.selectAll('image[bubble-item=true]').transition().duration(1000)
        .attr('grp', d => d.group)
        .attr('xlink:href', d => ri[d.rating - 1])
        .attr('x', d => xScale(d.rating) - radius)
        .attr('y', d => yScale(d.value) - radius)
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .attr('opacity', 1)
      svg.selectAll('circle[bubble-circle=true]').transition().duration(1000)
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

      svg.selectAll("image[bubble-item]")
        .attr("filter", "url(#image-shadow)");

    }

    const drawBubbles = (svg, nodes) => {
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
        .attr('bubble-circle', true)
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
          .style('top', `${textY - 150}px`)
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
        // simulation.alpha(1).restart();
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


    let imageGroups;
    if (!xyBubble) {
      imageGroups = drawBubbles(svg, nodes);
      simulation.on('tick', () => {
        imageGroups.selectAll('image[bubble-item]')
          .attr('x', d => d.x - d.value * 2.5)
          .attr('y', d => d.y - d.value * 2.5);
        imageGroups.select('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      })

    } else {
      imageGroups = transitionToXYBubble(svg, color);

    }

    const legends = d3.selectAll('.legend').nodes();
    if (legends.length === 0) {
      drawLegend(svg, color);
    }

    return () => {
      simulation.stop();
      svg.on('wheel', null);
    }


  }, [nodes, links, colorScheme, xyBubble]);


  return (
    <div style={{ width: '100%', position: 'relative' }} id='bubble'>
      <div>
        {/* <ColorSelector onSelect={getColor} /> */}
      </div>
      <svg ref={svgRef} width="100%" key={colorScheme.join('')}>
      </svg>
    </div>
  );
};

export default ScrollableBubbleChart;







// import React, { useState } from 'react';
// import D3BubbleChart from './Bubble';
// import XYBubble from './XYBubble';

// const ScrollableBubbleChart = ({data}) => {
//   const [showD3Chart, setShowD3Chart] = useState(true);

//   const toggleChart = () => {
//     setShowD3Chart((prev) => !prev);
//   };

//   return (
//     <div>
//       <button onClick={toggleChart}>Toggle Chart</button>
//       {showD3Chart ? <D3BubbleChart data={data} /> : <XYBubble data={data} />}
//     </div>
//   );
// };

// export default ScrollableBubbleChart;
