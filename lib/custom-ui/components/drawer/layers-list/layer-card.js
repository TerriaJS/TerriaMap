import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  ChevronRight as InspectIcon,
  Map as OnMapIcon,
  Delete as DeselectIcon
} from "@mui/icons-material";
import { useLayers } from "../../../context";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
import React from "react";

export const LayerCard = ({
  id,
  title,
  layer,
  viewState,
  setLayers,
  setActivatedLayer
}) => {
  const {
    activeLayerId,
    setActiveLayerId,
    setActivatedLayerParams,
    activatedLayerParams,
    setActiveLayerParams,
    activeLayerParams
  } = useLayers();

  const layer_names = {
    obs: "Observations",
    maxwvel63: "Maximum Wind Velocity",
    maxele63: "Maximum Water Level",
    swan_HS_max63: "Maximum Wave Height",
    maxele_level_downscaled_epsg4326: "Hi-Res Maximum Water Level"
  };

  const [active, setActive] = useState(layer.show);
  const currentlyActive = useMemo(() => id == activeLayerId, [activeLayerId]);

  // This function removes the layer from the workbench/map and from the context to sync the changes to the UI
  const handleRemoveLayer = () => {
    currentlyActive && setActivatedLayer(false);
    viewState.terria.workbench.remove(layer);
    setLayers(viewState.terria.workbench.items);
  };
  // This is for the layer visibility button, toggles visibility on and off
  const handleShowLayerSwitch = () => {
    layer.setTrait(CommonStrata.user, "show", !layer.show);
    setActive(layer.show);
  };
  // This makes sure the correct layer is showing in the information section
  const handleActivatedLayer = () => {
    // Set the color scale params for the clicked layer
    // If the params already exist skip
    if (activatedLayerParams.some((item) => item.id === layer.uniqueId)) {
      activatedLayerParams.forEach((element) => {
        if (element.id === layer.uniqueId) {
          setActiveLayerParams(element.params);
        }
      });
    } else {
      setActivatedLayerParams([
        ...activatedLayerParams,
        { id: layer.uniqueId, params: [0, 0] }
      ]);
      setActiveLayerParams([0, 0]);
    }

    currentlyActive ? setActiveLayerId(null) : setActiveLayerId(id);
    setActivatedLayer(layer);
  };
  // Clears the information section when the X is clicked
  const handleDeactivateLayer = () => {
    currentlyActive ? setActiveLayerId(null) : setActiveLayerId(id);
    setActivatedLayer(false);
  };

  console.log(layer);

  return (
    <Card
      sx={{
        width: "100%",
        // height: "50px",
        backgroundColor: currentlyActive ? "white" : "darkgrey",
        color: currentlyActive ? "#000c" : "#fffc",
        transition: "background-color 250ms, color 500ms",
        display: "flex",
        ".layer-name": {
          flex: 1,
          p: 0,
          pl: 2,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "start",
          fontSize: "12px",
          flexWrap: "wrap"
        },
        ".actions": {
          padding: 0,
          gap: 0,
          backgroundColor: "#fff3",
          ".MuiButtonBase-root": {
            borderRadius: 0,
            m: 0,
            width: "40px",
            height: "45px",
            "& .selection-icon": {
              transition: "color 250ms"
            },
            "&:hover .selection-icon": {
              // color: "crimson"
            }
          }
        }
      }}
    >
      <CardActions className="actions">
        <IconButton onClick={() => handleShowLayerSwitch()}>
          <OnMapIcon color={active ? "primary" : "disabled"} />
        </IconButton>
        <IconButton onClick={() => handleRemoveLayer()}>
          <DeselectIcon
            color="disabled"
            fontSize="small"
            className="selection-icon"
          />
        </IconButton>
      </CardActions>
      <CardContent className="layer-name" style={{ padding: "10px" }}>
        {layer.infoAsObject.DataDescription && (
          <p
            style={{
              color: "black",
              width: "100%",
              margin: 0,
              fontSize: "12px"
            }}
          >
            <span style={{ fontWeight: "bold" }}>{"Layer Name: "}</span>
            {layer_names[layer.infoAsObject.DataDescription.ProductType]}
          </p>
        )}

        <p
          style={{ color: "black", width: "100%", margin: 0, fontSize: "12px" }}
        >
          <span style={{ fontWeight: "bold" }}>{"Advisory: "}</span>
          {layer.infoAsObject.Advisory}
        </p>
        <p
          style={{ color: "black", width: "100%", margin: 0, fontSize: "12px" }}
        >
          <span style={{ fontWeight: "bold" }}>{"Date: "}</span>
          {layer.infoAsObject.EventDate}
        </p>
        <p
          style={{ color: "black", width: "100%", margin: 0, fontSize: "12px" }}
        >
          <span style={{ fontWeight: "bold" }}>{"Grid: "}</span>
          {layer.infoAsObject.GridType}
        </p>
        <p
          style={{ color: "black", width: "100%", margin: 0, fontSize: "12px" }}
        >
          <span style={{ fontWeight: "bold" }}>{"Type: "}</span>
          {layer.infoAsObject.EventType}
        </p>
        <p
          style={{ color: "black", width: "100%", margin: 0, fontSize: "12px" }}
        >
          <span style={{ fontWeight: "bold" }}>{"Location: "}</span>
          {"RENCI"}
        </p>
        <p
          style={{ color: "black", width: "100%", margin: 0, fontSize: "12px" }}
        >
          <span style={{ fontWeight: "bold" }}>{"Instance: "}</span>
          {layer.infoAsObject.InstanceName}
        </p>
      </CardContent>
      <CardActions>
        {currentlyActive ? (
          <IconButton onClick={() => handleDeactivateLayer()}>
            <CloseIcon color="warning" fontSize="small" />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleActivatedLayer()}>
            <InspectIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

LayerCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};
