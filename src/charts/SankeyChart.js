import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { SankeyChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([SankeyChart, CanvasRenderer]);

const Sankey = ({ data }) => {
  const chartRef = useRef(null);
  const nodes = data.data;
  const links = data.links;
  useEffect(() => {
    if (chartRef.current) {
      const chartOptions = {
        data: nodes,
        links: links,
        lineStyle: {
          color: "gradient",
          curveness: 0.5,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 10,
        },
        type: "sankey",
        bottom: "10%",
        emphasis: {
          focus: "adjacency",
        },
        
      };

      const myChart = echarts.init(chartRef.current);

      myChart.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: function(params) {
            return '<div style="transform: rotate(180deg);">' + params.name + 
            '<br> Value: ' + params.value + '</div>';
          }
        },
        series: {
          type: "sankey",
          layout: "none",
          orient: "vertical",
          nodeAlign: "justify",
          emphasis: {
            focus: "adjacency",
          },
          label: {
            fontSize: 15,
            position: "top",
            offset: [0, -30],
            rotate: 180
          },
          ...chartOptions,
        },
      });
    }
  });

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "1000px", transform: 'rotate(180deg)' }}
    />
  );
};
export default Sankey;
