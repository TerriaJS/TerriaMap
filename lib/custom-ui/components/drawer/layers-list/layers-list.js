import React from "react";
import Sortable from "react-anything-sortable";
import DraggableCard from "./draggableCards";
import { styled } from "@mui/material";
import Ul from "terriajs/lib/Styled/List";

const StyledUl = styled(Ul)`
  margin: 5px 0;
  li {
    &:first-child {
      margin-top: 0;
    }
  }
`;

export const LayersList = (props) => {
  const onSort = (
    sortedArray,
    currentDraggingSortData,
    currentDraggingIndex
  ) => {
    props.viewState.terria.workbench.moveItemToIndex(
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
        {props.viewState.terria.workbench.items.map((layer, e) => {
          return (
            <DraggableCard
              sortData={layer}
              data={layer}
              viewState={props.viewState}
              key={e}
              setLayers={props.setLayers}
              setActivatedLayer={props.setActivatedLayer}
              activatedLayer={props.activatedLayer}
            />
          );
        })}
      </Sortable>
    </StyledUl>
  );
};
