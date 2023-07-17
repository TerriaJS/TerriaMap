import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { useLayers } from "../../../context";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { LayerCard } from "./layer-card";
import { getStormLayers } from "../../utils/storm-layers";

export const LayersList = ({ viewState, terria }) => {
  const {
    activatedLayer,
    setActivatedLayer,
    contextViewState,
    setWebMapCatalogItems
  } = useLayers();

  useEffect(() => {
    let csvLayers = viewState.terria.workbench.items.map((layer) => {
      if (layer.type == "csv") {
        return layer;
      }
    });
    csvLayers.forEach((layer, i) => {
      if (i > 0) {
        viewState.terria.workbench.remove(layer);
      }
    });
  }, [viewState.terria.workbench.items]);

  useEffect(() => {
    // add any hurricane layers associated with
    // layers that are currently in the workbench
    viewState.terria.workbench.items.map((item) => {
      // look for storm layers
      // right now base identification on length of Advisory
      // length should be 3 or less if it is a storm layer
      if (item.infoAsObject.Advisory) {
        //&& (item.infoAsObject.Advisory.length < 4)) {
        // now retrieve storm layers associated with this storm, date and advisory
        const storm_layers = getStormLayers(viewState, item);
      }
    });
    console.log("hurricane layers");
  }, [viewState.terria.workbench.items]);

  const onDragEnd = (props) => {
    // dropped outside the list
    if (!props.destination) {
      return;
    }

    const layer = contextViewState.terria.workbench.items.find((item) => {
      return item.uniqueId == props.draggableId;
    });

    contextViewState.terria.workbench.moveItemToIndex(
      layer,
      props.destination.index
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <Stack
            terria={terria}
            spacing={1}
            padding={1}
            useFlexGap
            sx={{
              overflowY: "auto",
              height: "100%",
              width: "100%",
              background: snapshot.isDraggingOver ? "lightblue" : "#737171",
              maxWidth: "fit-content"
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {viewState.terria &&
              viewState.terria.workbench.items.map(
                (layer, index) =>
                  layer.type != "csv" &&
                  layer.type != "geojson" && (
                    <Draggable
                      key={layer.uniqueId}
                      draggableId={layer.uniqueId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: snapshot.isDragging
                              ? "lightgreen"
                              : "grey",
                            ...provided.draggableProps.style
                          }}
                        >
                          <div id={layer.uniqueId}>
                            <LayerCard
                              activatedLayer={activatedLayer}
                              setActivatedLayer={setActivatedLayer}
                              setLayers={setWebMapCatalogItems}
                              viewState={contextViewState}
                              layer={layer}
                              id={layer.uniqueId}
                              title={layer.name}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )
              )}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  );
};
