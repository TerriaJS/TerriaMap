import React from "react";
import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip
} from "@mui/material";
import {
  Remove as SelectedLayerIcon,
  Add as UnselectedLayerIcon
} from "@mui/icons-material";
import { useLayers } from "../../../../context";

export const Match = (props) => {
  const { id, name } = props;
  const { layerIsSelected, toggleLayerSelection } = useLayers();

  const addToTerriaAndContext = (id) => {
    props.viewState.terria.catalog.group.memberModels[0].memberModels.map(
      (member, index) => {
        if (
          props.viewState.terria.catalog.group.memberModels[0].memberModels[
            index
          ]
        ) {
          let selectedCatalogItem =
            props.viewState.terria.catalog.group.memberModels[0].memberModels[
              index
            ].memberModels.find((item) => item.uniqueId == id);
          props.viewState.terria.workbench.add(selectedCatalogItem);
        }
      }
    );
    toggleLayerSelection(id);
  };
  const removeFromTerriaAndContext = (id) => {
    props.viewState.terria.catalog.group.memberModels[0].memberModels.map(
      (member, index) => {
        if (
          props.viewState.terria.catalog.group.memberModels[0].memberModels[
            index
          ]
        ) {
          let selectedCatalogItem =
            props.viewState.terria.catalog.group.memberModels[0].memberModels[
              index
            ].memberModels.find((item) => item.uniqueId == id);
          props.viewState.terria.workbench.remove(selectedCatalogItem);
        }
      }
    );
    toggleLayerSelection(id);
  };
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          onClick={
            layerIsSelected(id)
              ? () => removeFromTerriaAndContext(id)
              : () => addToTerriaAndContext(id)
          }
        >
          <ListItemText
            primary={name}
            primaryTypographyProps={{
              color: layerIsSelected(id) ? "primary" : "grey"
            }}
          />
          {layerIsSelected(id) ? (
            <Tooltip title="Click to remove from tray" placement="left">
              <ListItemIcon>
                <SelectedLayerIcon color="primary" />
              </ListItemIcon>
            </Tooltip>
          ) : (
            <Tooltip title="Click to add to tray" placement="left">
              <ListItemIcon>
                <UnselectedLayerIcon color="default" />
              </ListItemIcon>
            </Tooltip>
          )}
        </ListItemButton>
      </ListItem>
    </List>
  );
};

Match.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string
};
