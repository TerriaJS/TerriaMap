import * as React from "react";
import { sortable } from "react-anything-sortable";
import Box from "terriajs/lib/Styled/Box";
import getPath from "terriajs/lib/Core/getPath";
import { styled } from "@mui/material/styles";
import { LayerCard } from "./layer-card";
import { Li } from "terriajs/lib/Styled/List";

const DraggableBox = styled(Box)`
  cursor: move;
`;

const StyledLi = styled(Li)`
  background: ${"brown"};
  color: ${"black"};
  border-radius: 4px;
  margin-bottom: 5px;
  width: 100%;
`;

function DraggableCard(props) {
  return (
    <StyledLi className={props.className}>
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
    </StyledLi>
  );
}

export default sortable(DraggableCard);
