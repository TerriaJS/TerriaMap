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
  console.log(Description);
  return (
    <div style={{ height: "100%" }}>
      <Legend item={activatedLayer} />
      <StyledUl
        overflowY="auto"
        overflowX="auto"
        scroll
        paddedHorizontally
        fullHeight
        style={{
          width: "100%",
          color: "black",
          position: "absolute",
          maxWidth: "-webkit-fill-available"
        }}
      >
        <Description
          style={{ padding: "8px", overflowX: "auto !important" }}
          item={activatedLayer}
        />
      </StyledUl>
    </div>
  );
};
