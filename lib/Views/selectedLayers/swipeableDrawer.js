import * as React from "react";
import { useState, useContext } from "react";
import Sortable from "react-anything-sortable";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
// import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import Button from "@mui/material/Button";
import { Context } from "../../context/context";
import DraggableCard from "./draggableCards";
// import Paper from "@mui/material/Paper";
import WorkbenchSplitScreen from "terriajs/lib/ReactViews/Workbench/WorkbenchSplitScreen";
import Ul from "terriajs/lib/Styled/List";

const drawerBleeding = 30;
const StyledUl = styled(Ul)`
  margin: 5px 0;
  li {
    &:first-child {
      margin-top: 0;
    }
  }
`;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: "#414141"
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800]
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  cursor: "pointer"
}));

function SwipeableEdgeDrawer(props) {
  const { window } = props;
  const { selectedLayers, setSelectedLayers } = useContext(Context);
  // console.log(selectedLayers);

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const onSort = (
    sortedArray,
    currentDraggingSortData,
    currentDraggingIndex
  ) => {
    props.data.terria.workbench.moveItemToIndex(
      currentDraggingSortData,
      currentDraggingIndex
    );
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(60% - ${drawerBleeding}px)`,
            overflow: "visible",
            background: "#414141"
          }
        }}
      />
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={props.open}
        onClose={props.toggleDrawer(false)}
        onOpen={props.toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            background: "#414141"
          }}
        >
          <Puller
            style={{ pointerEvents: "all" }}
            onClick={props.toggleDrawer(!props.open)}
          />
          <Typography sx={{ p: 1, pl: 2, color: "#e0e0e0" }}>
            {props.data.terria.workbench.items.length +
              " datasets selected on map"}
          </Typography>
        </StyledBox>
        <br></br>
        <div>
          <div
            style={{
              width: "100%",
              margin: "0px 0 0 12px",
              height: "367px",
              display: "inline-flex",
              paddingRight: "33px"
            }}
          >
            {/* <WorkbenchSplitScreen terria={props.data.terria} /> */}
            <StyledUl
              overflowY="auto"
              overflowX="hidden"
              scroll
              paddedHorizontally
              fullHeight
              column
              style={{ minWidth: 390, width: 390 }}
            >
              <Sortable
                onSort={onSort}
                direction="vertical"
                dynamic={true}
                // css={`
                //   width: 100%;
                // `}
              >
                {props.data.terria.workbench.items.map((layer) => {
                  return (
                    <DraggableCard
                      sortData={layer}
                      data={layer}
                      viewState={props.data}
                    />
                  );
                })}
              </Sortable>
            </StyledUl>
            <div
              style={{
                width: "-webkit-fill-available"
                // height: "295px",
                // background: "#76a3de4a"
              }}
            ></div>
          </div>
        </div>
      </SwipeableDrawer>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

export default SwipeableEdgeDrawer;
