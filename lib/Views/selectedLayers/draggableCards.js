import * as React from "react";
import { sortable } from "react-anything-sortable";
import Box, { BoxSpan } from "terriajs/lib/Styled/Box";
import getPath from "terriajs/lib/Core/getPath";
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
import Legend from "terriajs/lib/ReactViews/Workbench/Controls/Legend";
import FilterSection from "terriajs/lib/ReactViews/Workbench/Controls/FilterSection";
import ChartItemSelector from "terriajs/lib/ReactViews/Workbench/Controls/ChartItemSelector";
// import { Box } from "terriajs-plugin-api";
import Loader from "terriajs/lib/ReactViews/Loader";
import ShortReport from "terriajs/lib/ReactViews/Workbench/Controls/ShortReport";
import { ScaleWorkbenchInfo } from "terriajs/lib/ReactViews/Workbench/Controls/ScaleWorkbenchInfo";
import ViewingControls from "terriajs/lib/ReactViews/Workbench/Controls/ViewingControls";
import { Li } from "terriajs/lib/Styled/List";

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

const DraggableBox = styled(Box)`
  cursor: move;
`;

const StyledLi = styled(Li)`
  border-radius: 4px;
  margin-bottom: 5px;
  width: 100%;
`;

function DraggableCard(props) {
  const handleCheckboxChange = (event) => {
    props.data.setTrait(CommonStrata.user, "show", !props.data.show);
  };
  return (
    <StyledLi
      style={props.style}
      className={props.className}
      key={props.data.name}
    >
      <DraggableBox
        onMouseDown={props.onMouseDown}
        onTouchStart={props.onTouchStart}
        title={getPath(props.data, " → ")}
        fullWidth
      >
        <Card sx={{ minWidth: 345, width: 345, backgroundColor: "#76a3de26" }}>
          <CardContent>
            <div style={{ display: "inline-flex" }}>
              <PinkSwitch
                {...label}
                size="small"
                defaultChecked
                onChange={(e) => handleCheckboxChange(e)}
              />
              <Typography
                variant="body2"
                color="#fff"
                sx={{ fontWeight: "bold" }}
              >
                {props.data.name}
              </Typography>
            </div>
          </CardContent>
          <hr></hr>
          <CardActions>
            {/* <Button size="small" variant="contained">
              Ideal Zoom
            </Button> */}
            {/* <Button size="small" variant="contained">
              About Data
            </Button> */}
            <Button size="small" variant="contained">
              Expand
            </Button>
            <Button size="small" variant="contained">
              Remove
            </Button>
          </CardActions>

          {/* <WorkbenchItemControls
        item={props.data.item}
        viewState={props.viewState}
      /> */}

          {/* <WorkbenchItemControls
          item={props.data}
          viewState={props.viewState}
        /> */}
          {/* <FilterSection item={props.data} />
          <Legend item={props.data} />
          <ChartItemSelector item={props.data} /> */}
          {/* <ViewingControls item={props.data} viewState={props.viewState} /> */}
          {/* <ShortReport item={props.data} /> */}
          {/* <ScaleWorkbenchInfo item={props.data} /> */}

          <CardActions>
            <NonLinearSlider data={props.data} />
          </CardActions>
        </Card>
      </DraggableBox>
    </StyledLi>
  );
}

export default sortable(DraggableCard);
