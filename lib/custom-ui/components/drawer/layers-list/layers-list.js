// import { Stack } from "@mui/material";
// import { LayerCard } from "./layer-card";
// import { useLayers } from "../../../context";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import React from "react";

// export const LayersList = ({ layers }) => {
//   const { layerSelection, swapLayers } = useLayers();

//   const onDragEnd = ({ source, destination }) => {
//     // dropped outside the list
//     if (!destination) {
//       return;
//     }
//     const firstLayerId = Object.values(layerSelection).find(
//       (layer) => layer.order === source.index
//     )?.id;
//     const secondLayerId = Object.values(layerSelection).find(
//       (layer) => layer.order === destination.index
//     )?.id;
//     firstLayerId && secondLayerId && swapLayers(firstLayerId, secondLayerId);
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <Droppable droppableId="droppable">
//         {(provided, snapshot) => (
//           <Stack
//             spacing={1}
//             padding={1}
//             useFlexGap
//             sx={{
//               overflowY: "auto",
//               height: "100%",
//               width: "100%",
//               background: snapshot.isDraggingOver ? "lightblue" : "lightgrey"
//             }}
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {Object.values(layerSelection)
//               .sort((l, m) => l.order - m.order)
//               .map(({ id, name }, index) => (
//                 <Draggable
//                   key={`layer-card-${id}`}
//                   draggableId={id}
//                   index={index}
//                 >
//                   {(provided, snapshot) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       style={{
//                         background: snapshot.isDragging ? "lightgreen" : "grey",
//                         ...provided.draggableProps.style
//                       }}
//                     >
//                       <LayerCard id={id} title={name} />
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//           </Stack>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

import { Stack } from "@mui/material";
import { LayerCard } from "./layer-card";
import React from "react";
import Sortable from "react-anything-sortable";
import DraggableCard from "../../../../Views/selectedLayers/draggableCards";
// import Box, { BoxSpan } from "terriajs/lib/Styled/Box";

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
      {props.layers[0].name !== "default" && (
        <>
          {props.layers.map((layer) => {
            return (
              <DraggableCard
                sortData={layer}
                data={layer}
                viewState={props.viewState}
              />
            );
          })}
        </>
      )}
    </Sortable>
  );
};
