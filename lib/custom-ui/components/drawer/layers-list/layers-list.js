import React from "react";
import Sortable from "react-anything-sortable";
import DraggableCard from "./draggableCards";

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
    <Sortable
      onSort={onSort}
      direction="vertical"
      dynamic={true}
      css={`
        width: 100%;
        overflowy: auto;
        display: inline-flex;
        flex-wrap: wrap;
        gap: 10px;
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
  );
};
