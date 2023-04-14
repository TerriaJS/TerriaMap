import React, { useContext } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import StormIcon from "@mui/icons-material/Storm";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AdcircFilterForm from "../filterPanel/AdcircFilterPanel";
import { Context } from "../../context/context";

function BasicPopover(props) {
  const { layers, setLayerData } = useContext(Context);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setLayerData("");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <button
        style={{ background: "none", border: "none" }}
        aria-describedby={id}
        variant="text"
        onClick={handleClick}
      >
        {props.icon}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <div>
          <AdcircFilterForm view={props.view} />
        </div>
      </Popover>
    </div>
  );
}

function iconPicker(typeOfLayers) {
  switch (typeOfLayers) {
    case "ADCIRC":
      return <StormIcon style={{ fill: "white" }} />;
      break;
    case "EC FLOW":
      return <ThunderstormIcon style={{ fill: "white" }} />;
      break;
  }
}

export default function LayersIcon(props) {
  // console.log(props.view);
  return (
    <li className="tooltip" style={{ listStyle: "none", marginBottom: "10px" }}>
      <span class="tooltiptext">{props.title}</span>
      <BasicPopover view={props.view} icon={iconPicker(props.title)} />
    </li>
  );
}
