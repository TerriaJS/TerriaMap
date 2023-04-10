import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import NonLinearSlider from "./opacityScale";

const label = { inputProps: { "aria-label": "Size switch demo" } };

export default function DraggableCard(props) {
  return (
    <Card sx={{ maxWidth: 345, backgroundColor: "#00000008" }}>
      <CardContent>
        <div style={{ display: "inline-flex" }}>
          <Switch {...label} defaultChecked size="small" />
          <Typography variant="body2" color="text.secondary">
            {props.data.name}
          </Typography>
        </div>
      </CardContent>
      <hr></hr>
      <CardActions>
        <Button size="small">Ideal Zoom</Button>
        <Button size="small">About Data</Button>
        <Button size="small">more</Button>
      </CardActions>
      <CardActions>
        <NonLinearSlider />
      </CardActions>
    </Card>
  );
}
