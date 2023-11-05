import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { SankeyChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([SankeyChart, CanvasRenderer]);


const Sankey = ({ data, links }) => {
    const chartRef = useRef(null);
    useEffect(() => {
        if (chartRef.current) {
            const chartOptions = {
                data,
                links,
                lineStyle: {
                    color: 'source',
                    curveness: 0.5
                },
                type: 'sankey',
                bottom: '10%',
                emphasis: {
                    focus: 'adjacency'
                }
            };

            const myChart = echarts.init(chartRef.current);

            myChart.setOption({
                series: {
                    type: 'sankey',
                    layout: 'none',
                    emphasis: {
                        focus: 'adjacency',
                    },
                    label: {
                        fontSize: 20, 
                    },
                    ...chartOptions,
                },
            });
        }
    })

    return <div ref={chartRef} style={{ width: '100%', height: '600px' }} />;
}
export default Sankey;