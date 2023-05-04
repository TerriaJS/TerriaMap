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
import React from "react";

export const Match = (props) => {
  const { id, name } = props;
  const { layerIsSelected, toggleLayerSelection } = useLayers();

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={() => toggleLayerSelection(id)}>
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  stormName: PropTypes.string.isRequired,
  grid: PropTypes.string.isRequired,
  instance: PropTypes.string.isRequired
};
