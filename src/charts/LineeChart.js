import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
    DatasetComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    TransformComponent,
    DataZoomComponent,
    LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    DatasetComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    TransformComponent,
    LineChart,
    CanvasRenderer,
    LabelLayout,
    UniversalTransition,
    DataZoomComponent,
    LegendComponent
]);

const LineeChart = ({ data }) => {
    const chartRef = useRef(null)

    useEffect(() => {
        var lineChart = echarts.init(chartRef.current);
        var option;

        const timeline = Object.keys(data['Beauty'])
        const seriesList = [];
        const datasetWithFilters = []

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                let v = Object.values(data[key])
                seriesList.push(
                    {
                        type: 'line',
                        datasetId: 'dataset_' + key,
                        showSymbol: false,
                        name: key,
                        endLabel: {
                            show: false,
                            formatter: function (val) {
                                return val.seriesName + ': ' + val.value;
                            }
                        },
                        labelLayout: {
                            moveOverlap: 'shiftY'
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        encode: {
                            x: 'Year',
                            y: 'Score',
                            label: ['Category', 'Score'],
                            itemName: 'Year',
                            tooltip: ['Score']
                        },
                        data: v,
                        smooth: true
                    }
                );
                datasetWithFilters.push({
                    id: 'data_' + key,
                    fromDatasetId: 'dataset_raw',
                    transform: {
                        type: 'filter',
                        config: {
                        and: [
                                { dimension: 'Year', gte: 1950 },
                                { dimension: 'Category', '=': key }
                            ]
                        }
                    }
                });
            }
        }
    
        option = {
            animationDuration: 1000,
            dataset: [
                {
                  id: 'dataset_raw',
                  source: data
                },
                ...datasetWithFilters
            ],
            dataZoom: [
                {
                  startValue: '2003-04'
                },
                {
                  type: 'inside'
                }
            ],
            legend: { 
                data: seriesList.map(item => item.name),  
                selected: {},
            },
            title: {
                text: ''
            },
            tooltip: {
                order: 'valueDesc',
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                nameLocation: 'middle',
                data: timeline
            },
            yAxis: {
                name: 'Number of reviews'
            },
            grid: {
                right: 140
            },
            series: seriesList
        };
        

        option && lineChart.setOption(option);

    }, [data])
    return (
        <div ref={chartRef} style={{ width: '100%', height: '500px' }}></div>
    );
}

export default LineeChart;