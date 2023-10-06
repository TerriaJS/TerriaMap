import Legend from "terriajs/lib/ReactViews/Workbench/Controls/Legend";
import ChartItemSelector from "terriajs/lib/ReactViews/Workbench/Controls/ChartItemSelector";
import Description from "terriajs/lib/ReactViews/Preview/Description";
import React from "react";
import { styled } from "@mui/material/styles";
import Ul from "terriajs/lib/Styled/List";

const StyledUl = styled(Ul)`
  margin: 5px 0;
  li {
    &:first-child {
      margin-top: 0;
    }
  }
`;

export const DetailsTab = ({ activatedLayer }) => {
  return (
    <div
      style={{
        color: "black",
        position: "absolute",
        // width: "-webkit-fill-available",
        // height: "-webkit-fill-available",
        width: "99%",
        height: "80%",
        overflowY: "scroll",
        paddingLeft: "8px"
      }}
    >
      <Legend
        item={activatedLayer}
        style={{ background: "#00d5ff26", marginTop: "7px" }}
      />
      <ChartItemSelector
        item={activatedLayer}
        style={{ background: "#00d5ff26", marginTop: "7px" }}
      />

      <Description
        style={{
          padding: "8px",
          overflowX: "auto !important",
          position: "absolute"
        }}
        item={activatedLayer}
      />
    </div>
  );
};
