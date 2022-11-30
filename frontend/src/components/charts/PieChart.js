import React from 'react';

import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  Export
} from 'devextreme-react/pie-chart';

const Pie = ({ va }) => {
  const pointClickHandler = (e) => {
    this.toggleVisibility(e.target);
  };

  const legendClickHandler = (e) => {
    const arg = e.target;
    const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];
    this.toggleVisibility(item);
  };

  return (
    <PieChart
      id="pie"
      dataSource={va}
      palette="Bright"
      title="Covid Effected"
      onPointClick={pointClickHandler}
      onLegendClick={legendClickHandler}
    >
      <Series
        argumentField="Race"
        valueField="Affected"
      >
        <Label visible={true}>
          <Connector visible={true} width={1} />
        </Label>
      </Series>

      <Size height={600}/>
      <Export enabled={true} />
    </PieChart>
  );
};

export default Pie;
