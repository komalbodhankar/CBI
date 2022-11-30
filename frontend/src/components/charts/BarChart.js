import React from 'react';
import {
    Chart, Series, CommonSeriesSettings, Format, Legend, Export, Size, ArgumentAxis, ZoomAndPan, ScrollBar, Label
} from 'devextreme-react/chart';
import { color } from '@mui/system';

const BarChart = ({rows, columns, argumentField}) => {

    console.log('inside bar chart', rows);

    const onPointClick = (e) => {
        e.target.select();
    }

    return (
        <Chart id="chart"
        title={"Bar Chart Data Presentation"}
        dataSource={rows}
        onPointClick={onPointClick}
        >
            <CommonSeriesSettings
            argumentField={argumentField}
            type="bar"
            hoverMode="allArgumentPoints"
            selectionMode="allArgumentPoints"
            >
            <Label 
                visible={true}
            >
                <Format type="fixedPoint" precision={0} />
            </Label>
            </CommonSeriesSettings>
            {
                columns.map((item) => 
                <Series
                    key={item.value}
                    valueField={item.value}
                    color="#ffaa66"
                    name={item.name} />
                )
            }
            <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend>
            <ArgumentAxis 
                defaultVisualRange={{length: 100}}
            >
                <Label
                    rotationAngle={45}
                    displayMode="rotate"
                />
            </ArgumentAxis>
            <ScrollBar visible={true} />
            <ZoomAndPan argumentAxis="both"/>
            <Size height={600}/>
            <Export enabled={true} />
        </Chart>
    );
};

export default BarChart;