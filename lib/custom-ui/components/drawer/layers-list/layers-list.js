// import React from "react";
// import Sortable from "react-anything-sortable";
// import DraggableCard from "./draggableCards";
// import { styled } from "@mui/material";
// import Ul from "terriajs/lib/Styled/List";
// import { useLayers } from "../../../context";

// const StyledUl = styled(Ul)`
//   margin: 5px 0;
//   li {
//     &:first-child {
//       margin-top: 0;
//     }
//   }
// `;

// export const LayersList = (props) => {
//   const { activatedLayer, setActivatedLayer, contextViewState } = useLayers();
//   const onSort = (
//     sortedArray,
//     currentDraggingSortData,
//     currentDraggingIndex
//   ) => {
//     contextViewState.terria.workbench.moveItemToIndex(
//       currentDraggingSortData,
//       currentDraggingIndex
//     );
//   };

//   return (
//     <StyledUl
//       overflowY="auto"
//       overflowX="hidden"
//       scroll
//       paddedHorizontally
//       fullWidth
//       fullHeight
//       column
//     >
//       <Sortable
//         // onSort={onSort}
//         direction="vertical"
//         dynamic={true}
//         css={`
//           width: 100%;
//         `}
//       >
//         {props.layers.map((layer, e) => {
//           return (
//             <DraggableCard
//               sortData={layer}
//               data={layer}
//               viewState={props.viewState}
//               key={layer.uniqueId + e}
//               setLayers={props.setLayers}
//               setActivatedLayer={setActivatedLayer}
//               activatedLayer={activatedLayer}
//             />
//           );
//         })}
//       </Sortable>
//     </StyledUl>
//   );
// };
import React from "react";
import { Stack } from "@mui/material";
import { useLayers } from "../../../context";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { LayerCard } from "./layer-card";

export const LayersList = ({ layers, viewState, setLayers }) => {
  const {
    activatedLayer,
    setActivatedLayer,
    contextViewState,
    layerSelection,
    swapLayers
  } = useLayers();

  const onDragEnd = ({ source, destination }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }
    const firstLayerId = Object.values(layerSelection).find(
      (layer) => layer.order === source.index
    )?.id;
    const secondLayerId = Object.values(layerSelection).find(
      (layer) => layer.order === destination.index
    )?.id;
    firstLayerId && secondLayerId && swapLayers(firstLayerId, secondLayerId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <Stack
            spacing={1}
            padding={1}
            useFlexGap
            sx={{
              overflowY: "auto",
              height: "100%",
              width: "100%",
              background: snapshot.isDraggingOver ? "lightblue" : "lightgrey"
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {layers.map((layer, index) => (
              <Draggable
                key={`layer-card-${index}`}
                draggableId={layer.uniqueId}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      background: snapshot.isDragging ? "lightgreen" : "grey",
                      ...provided.draggableProps.style
                    }}
                  >
                    <div id={"id" + Math.random()}>
                      <LayerCard
                        activatedLayer={activatedLayer}
                        setActivatedLayer={setActivatedLayer}
                        setLayers={setLayers}
                        viewState={viewState}
                        layer={layer}
                        id={layer.uniqueId}
                        title={layer.name}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  );
};
