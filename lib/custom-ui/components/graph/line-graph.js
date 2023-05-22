import PropTypes from "prop-types";
import React from "react";
// import "../../../../node_modules/react-vis/dist/style.css";
// import { XYPlot, LineSeries } from "react-vis";

const bottomAxis = {
  tickSize: 5,
  tickPadding: 5,
  tickRotation: 0,
  legend: "time",
  legendOffset: 36,
  legendPosition: "middle"
};

const leftAxis = {
  tickSize: 5,
  tickPadding: 5,
  tickRotation: 0,
  legend: "value",
  legendOffset: -40,
  legendPosition: "middle"
};

export const LineGraph = ({ activatedLayer, height }) => {
  console.log(activatedLayer);
  const data = [
    { x: 0, y: 8 },
    { x: 1, y: 5 },
    { x: 2, y: 4 },
    { x: 3, y: 9 },
    { x: 4, y: 1 },
    { x: 5, y: 7 },
    { x: 6, y: 6 },
    { x: 7, y: 3 },
    { x: 8, y: 2 },
    { x: 9, y: 0 }
  ];
  return (
    <div style={{ height, width: "100%" }}>
      <div>
        {/* <XYPlot height={300} width={300}> */}
        {/* <LineSeries data={data} /> */}
        {/* </XYPlot> */}
        <div>test</div>
      </div>
    </div>
  );
};

LineGraph.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.string.isRequired
};
