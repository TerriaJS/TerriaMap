import React from "react";
import Sortable from "react-anything-sortable";
import DraggableCard from "./draggableCards";
import { styled } from "@mui/material";
import Ul from "terriajs/lib/Styled/List";
import { useLayers } from "../../../context";

const StyledUl = styled(Ul)`
  margin: 5px 0;
  li {
    &:first-child {
      margin-top: 0;
    }
  }
`;

export const LayersList = (props) => {
  const { activatedLayer, setActivatedLayer, contextViewState } = useLayers();
  const onSort = (
    sortedArray,
    currentDraggingSortData,
    currentDraggingIndex
  ) => {
    contextViewState.terria.workbench.moveItemToIndex(
      currentDraggingSortData,
      currentDraggingIndex
    );
  };

  return (
    <StyledUl
      overflowY="auto"
      overflowX="hidden"
      scroll
      paddedHorizontally
      fullWidth
      fullHeight
      column
    >
      <Sortable
        onSort={onSort}
        direction="vertical"
        dynamic={true}
        css={`
          width: 100%;
        `}
      >
        {props.layers.map((layer, e) => {
          return (
            <DraggableCard
              sortData={layer}
              data={layer}
              viewState={props.viewState}
              key={e}
              setLayers={props.setLayers}
              setActivatedLayer={setActivatedLayer}
              activatedLayer={activatedLayer}
            />
          );
        })}
      </Sortable>
    </StyledUl>
  );
};
