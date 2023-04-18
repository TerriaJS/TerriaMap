import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import NonLinearSlider from "./opacityScale";
import { alpha, styled } from "@mui/material/styles";
import CommonStrata from "terriajs/lib/Models/Definition/CommonStrata";
import WorkbenchItemControls from "terriajs/lib/ReactViews/Workbench/Controls/WorkbenchItemControls";
import { Box } from "terriajs-plugin-api";
import Loader from "terriajs/lib/ReactViews/Loader";
import ShortReport from "terriajs/lib/ReactViews/Workbench/Controls/ShortReport";
import { ScaleWorkbenchInfo } from "terriajs/lib/ReactViews/Workbench/Controls/ScaleWorkbenchInfo";
import ViewingControls from "terriajs/lib/ReactViews/Workbench/Controls/ViewingControls";
const label = { inputProps: { "aria-label": "Size switch demo" } };

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#1976d2",
    "&:hover": {
      backgroundColor: alpha("#1976d2", theme.palette.action.hoverOpacity)
    }
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#000"
  }
}));

export default function DraggableCard(props) {
  const handleCheckboxChange = (event) => {
    props.data.setTrait(CommonStrata.user, "show", !props.data.show);
  };
  console.log(props.viewState);
  return (
    <Card sx={{ width: 345, backgroundColor: "#76a3de26" }}>
      <CardContent>
        <div style={{ display: "inline-flex" }}>
          <PinkSwitch
            {...label}
            size="small"
            defaultChecked
            onChange={(e) => handleCheckboxChange(e)}
          />
          <Typography variant="body2" color="#fff" sx={{ fontWeight: "bold" }}>
            {props.data.name}
          </Typography>
        </div>
      </CardContent>
      <hr></hr>
      {/* <CardActions>
        <Button size="small" variant="contained">
          Ideal Zoom
        </Button>
        <Button size="small" variant="contained">
          About Data
        </Button>
        <Button size="small" variant="contained">
          Remove
        </Button>
      </CardActions> */}
      {/* <WorkbenchItemControls
        item={props.data.item}
        viewState={props.viewState}
      /> */}

      {/* <WorkbenchItemControls
          item={props.data}
          viewState={props.viewState}
        /> */}
      {/* <ViewingControls item={props.data} viewState={props.viewState} /> */}
      {/* <ShortReport item={props.data} /> */}
      {/* <ScaleWorkbenchInfo item={props.data} /> */}

      <CardActions>
        <NonLinearSlider data={props.data} />
      </CardActions>
    </Card>
  );
}
