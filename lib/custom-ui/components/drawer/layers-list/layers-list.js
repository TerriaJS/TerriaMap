import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useLayers } from "../../../context";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { LayerCard } from "./layer-card";
import { addStormLayers } from "../../utils/storm-layers";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

export const LayersList = ({ viewState, terria }) => {
  const {
    activatedLayer,
    setActivatedLayer,
    setWebMapCatalogItems,
    toggleLayerSelection,
    checkedLayers,
    setCheckedLayers
  } = useLayers();
  const [checked, setChecked] = React.useState(false);
  const [disableDelete, setDisableDelete] = React.useState(true);
  const [addHurricaneLayers, setAddHurricaneLayers] = React.useState(true);

  useEffect(() => {
    let csvLayers = viewState.terria.workbench.items.map((layer) => {
      if (layer.type === "csv") {
        return layer;
      }
    });
    csvLayers.forEach((layer, i) => {
      if (i > 0) {
        viewState.terria.workbench.remove(layer);
      }
    });
  }, [viewState.terria.workbench.items]);

  useEffect(
    () => {
      // add any hurricane layers associated with
      // layers that are currently in the workbench
      viewState.terria.workbench.items.map((item) => {
        // look for storm layers
        // right now base identification on length of Advisory
        // length should be 3 or less if it is a storm layer
        if (
          item.infoAsObject.Advisory &&
          item.infoAsObject.Advisory.length < 4
        ) {
          if (addHurricaneLayers) {
            // now add storm layers associated with this storm, date and advisory
            addStormLayers(viewState, item);
          }
        }
      });
    },
    [viewState.terria.workbench.items],
    addHurricaneLayers
  );

  const handleSelectAll = (e) => {
    if (checked === false) {
      setChecked(true);
      setDisableDelete(false);
      checkedLayers.forEach((l) => {
        if (l.checked !== true) {
          l.checked = true;
          l.setChecked(true);
        }
      });
    } else {
      setChecked(false);
      setDisableDelete(true);
      checkedLayers.forEach((l) => {
        if (l.checked === true) {
          l.checked = false;
          l.setChecked(false);
        }
      });
    }
  };

  const handleDelete = (e) => {
    checkedLayers.forEach((l) => {
      if (l.checked === true) {
        l.delete();
      }
    });
  };

  const onDragEnd = (props) => {
    // dropped outside the list
    if (!props.destination) {
      return;
    }

    const layer = viewState.terria.workbench.items.find((item) => {
      return item.uniqueId === props.draggableId;
    });

    viewState.terria.workbench.moveItemToIndex(layer, props.destination.index);
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
              background: snapshot.isDraggingOver ? "lightblue" : "#585858",
              maxWidth: "fit-content"
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <div
              style={{
                display: "flex",
                "justify-content": "start",
                columnGap: "10px"
              }}
            >
              <Checkbox
                sx={{
                  color: "#008daa",
                  "&.Mui-checked": {
                    color: "#008daa"
                  }
                }}
                checked={checked}
                onChange={handleSelectAll}
                inputProps={{ "aria-label": "controlled" }}
              />
              <Button
                aria-label="delete"
                disabled={disableDelete}
                style={{
                  backgroundColor: "rgb(211 47 47 / 39%)",
                  fontSize: "12px",
                  width: "65px"
                }}
                onClick={handleDelete}
                variant="contained"
              >
                <DeleteIcon />
              </Button>
            </div>
            {viewState.terria &&
              viewState.terria.workbench.items.map(
                (layer, index) =>
                  layer.type !== "csv" && (
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
                              : "#585858",
                            ...provided.draggableProps.style
                          }}
                        >
                          <div id={layer.uniqueId}>
                            <LayerCard
                              activatedLayer={activatedLayer}
                              setActivatedLayer={setActivatedLayer}
                              setLayers={setWebMapCatalogItems}
                              viewState={viewState}
                              layer={layer}
                              id={layer.uniqueId}
                              title={layer.name}
                              checkedLayers={checkedLayers}
                              setCheckedLayers={setCheckedLayers}
                              setDisableDelete={setDisableDelete}
                              setAddHurricaneLayers={setAddHurricaneLayers}
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