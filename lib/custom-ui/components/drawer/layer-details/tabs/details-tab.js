import Legend from "terriajs/lib/ReactViews/Workbench/Controls/Legend";
import ChartItemSelector from "terriajs/lib/ReactViews/Workbench/Controls/ChartItemSelector";
import Description from "terriajs/lib/ReactViews/Preview/Description";
import React from "react";
// import { styled } from "@mui/material/styles";
// import Ul from "terriajs/lib/Styled/List";
// const StyledUl = styled(Ul)`
//   margin: 5px 0;
//   li {
//     &:first-child {
//       margin-top: 0;
//     }
//   }
// `;

export const DetailsTab = ({ activatedLayer }) => {
  // add env parameters for legend url style
  // this will cause the legend to refresh with new colormap range
  const params = activatedLayer.getTrait("definition", "parameters");
  if (params) {
    let url_parts = activatedLayer.legends[0].url.split("&");
    // check to make sure there are not already env params defined
    // if so, remove them
    for (const part_idx in url_parts) {
      console.log(url_parts[part_idx]);
      if (url_parts[part_idx].startsWith("env=")) {
        url_parts.splice(part_idx, 1);
      }
    }
    activatedLayer.setTrait("definition", "legends", [
      { url: url_parts.join("&") }
    ]);
    activatedLayer.setTrait("definition", "legends", [
      {
        url: activatedLayer.legends[0].url + "&env=" + params.env,
        urlMimeType: "image/png"
      }
    ]);
  }
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
