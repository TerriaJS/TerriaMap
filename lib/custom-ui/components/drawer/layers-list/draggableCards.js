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
