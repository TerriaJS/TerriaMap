import { Box } from "@mui/material";
import Legend from "terriajs/lib/ReactViews/Workbench/Controls/Legend";
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
    <div style={{ height: "100%" }}>
      <Legend item={activatedLayer} />
      <StyledUl
        overflowY="auto"
        overflowX="hidden"
        scroll
        paddedHorizontally
        fullHeight
        style={{
          width: "-webkit-fill-available",
          color: "black"
        }}
      >
        <Description style={{ padding: "8px" }} item={activatedLayer} />
      </StyledUl>
    </div>
  );
};
