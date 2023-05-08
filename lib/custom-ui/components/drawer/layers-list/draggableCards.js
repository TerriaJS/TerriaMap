import * as React from "react";
import { sortable } from "react-anything-sortable";
import Box from "terriajs/lib/Styled/Box";
import getPath from "terriajs/lib/Core/getPath";
import { styled } from "@mui/material/styles";
import { LayerCard } from "./layer-card";

const DraggableBox = styled(Box)`
  cursor: move;
`;

function DraggableCard(props) {
  return (
    <DraggableBox
      onMouseDown={props.onMouseDown}
      onTouchStart={props.onTouchStart}
      title={getPath(props.data, " → ")}
      fullWidth
    >
      <LayerCard
        activatedLayer={props.activatedLayer}
        setActivatedLayer={props.setActivatedLayer}
        setLayers={props.setLayers}
        viewState={props.viewState}
        layer={props.data}
        id={props.data.uniqueId}
        title={props.data.name}
      />
    </DraggableBox>
  );
}

export default sortable(DraggableCard);

// import getPath from "terriajs/lib/Core/getPath";
// import { alpha, styled } from "@mui/material/styles";
// import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
// import WorkbenchItemControls from "terriajs/lib/ReactViews/Workbench/Controls/WorkbenchItemControls";
// import Legend from "terriajs/lib/ReactViews/Workbench/Controls/Legend";
// import FilterSection from "terriajs/lib/ReactViews/Workbench/Controls/FilterSection";
// import ChartItemSelector from "terriajs/lib/ReactViews/Workbench/Controls/ChartItemSelector";
// import Loader from "terriajs/lib/ReactViews/Loader";
// import { ScaleWorkbenchInfo } from "terriajs/lib/ReactViews/Workbench/Controls/ScaleWorkbenchInfo";
// import ViewingControls from "terriajs/lib/ReactViews/Workbench/Controls/ViewingControls";
// import { Li } from "terriajs/lib/Styled/List";

// function DraggableCard(props) {
//   return (

//         <Card sx={{ minWidth: 345, width: 345, backgroundColor: "#76a3de26" }}>
//           {/* <FilterSection item={props.data} />
//           <Legend item={props.data} />
//           <ChartItemSelector item={props.data} /> */}
//           {/* <ViewingControls item={props.data} viewState={props.viewState} /> */}
//           {/* <ScaleWorkbenchInfo item={props.data} /> */}
//         </Card>

//   );
// }
