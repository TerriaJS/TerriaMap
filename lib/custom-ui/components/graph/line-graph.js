import PropTypes from "prop-types";
import { ResponsiveLine } from "@nivo/line";

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

export const LineGraph = ({ data = [], height }) => {
  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 32, right: 32, bottom: 48, left: 48 }}
        xScale={{ type: "linear", min: 0, max: 24 }}
        yScale={{
          type: "linear",
          min: 0,
          max: 100,
          stacked: false,
          reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={bottomAxis}
        axisLeft={leftAxis}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointLabelYOffset={-12}
        useMesh={true}
        enableSlices="x"
      />
    </div>
  );
};

LineGraph.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.string.isRequired
};
