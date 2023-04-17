import * as React from "react";
import { useState, useContext } from "react";
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

const drawerBleeding = 30;

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

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
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
            {"Selected layers " + selectedLayers.length}
          </Typography>
        </StyledBox>
        <br></br>
        <div style={{ display: "inline-flex" }}>
          <div
            style={{
              overflow: "auto",
              width: "526px",
              paddingLeft: "17px",
              height: "292px"
            }}
          >
            {selectedLayers.map((layer) => {
              return (
                <>
                  <DraggableCard data={layer} />
                  <br></br>
                </>
              );
            })}
          </div>
          {/* <div
            style={{
              width: "-webkit-fill-available",
              marginLeft: "12px",
              marginRight: "12px",
              height: "100px",
              background: "#76a3de4a"
            }}
          >
            test
          </div> */}
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

// import * as React from "react";
// import { useState, useContext } from "react";
// import PropTypes from "prop-types";
// import { Global } from "@emotion/react";
// import { styled } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import { grey } from "@mui/material/colors";
// import Box from "@mui/material/Box";
// // import Skeleton from "@mui/material/Skeleton";
// import Typography from "@mui/material/Typography";
// import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// // import Button from "@mui/material/Button";
// import { Context } from "../../context/context";
// import DraggableCard from "./draggableCards";
// // import Paper from "@mui/material/Paper";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// const drawerBleeding = 30;

// const Root = styled("div")(({ theme }) => ({
//   height: "100%",
//   backgroundColor:
//     theme.palette.mode === "light"
//       ? grey[100]
//       : theme.palette.background.default
// }));

// const StyledBox = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800]
// }));

// const Puller = styled(Box)(({ theme }) => ({
//   width: 30,
//   height: 6,
//   backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
//   borderRadius: 3,
//   position: "absolute",
//   top: 8,
//   left: "calc(50% - 15px)",
//   cursor: "pointer"
// }));

// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

// function SwipeableEdgeDrawer(props) {
//   const { window } = props;
//   const { selectedLayers, setSelectedLayers } = useContext(Context);
//   const [list, setList] = React.useState(selectedLayers);
//   // console.log(selectedLayers);

//   const handleDragEnd = ({ destination, source }) => {
//     if (!destination) return;

//     setList(reorder(list, source.index, destination.index));
//   };

//   // This is used only for the example
//   const container =
//     window !== undefined ? () => window().document.body : undefined;

//   return (
//     <Root>
//       <CssBaseline />
//       <Global
//         styles={{
//           ".MuiDrawer-root > .MuiPaper-root": {
//             height: `calc(50% - ${drawerBleeding}px)`,
//             overflow: "visible"
//             // width: "300px"
//           }
//         }}
//       />
//       <SwipeableDrawer
//         container={container}
//         anchor="bottom"
//         open={props.open}
//         onClose={props.toggleDrawer(false)}
//         onOpen={props.toggleDrawer(true)}
//         swipeAreaWidth={drawerBleeding}
//         disableSwipeToOpen={false}
//         ModalProps={{
//           keepMounted: true
//         }}
//       >
//         <StyledBox
//           sx={{
//             position: "absolute",
//             top: -drawerBleeding,
//             borderTopLeftRadius: 8,
//             borderTopRightRadius: 8,
//             visibility: "visible",
//             right: 0,
//             left: 0
//           }}
//         >
//           <Puller
//             style={{ pointerEvents: "all" }}
//             onClick={props.toggleDrawer(!props.open)}
//           />
//           <Typography sx={{ p: 1, color: "text.secondary" }}>
//             {selectedLayers.length + " layers selected"}
//           </Typography>
//         </StyledBox>
//         {/* <div style={{ display: "inline-flex" }}> */}
//         <StyledBox
//           sx={{
//             px: 2,
//             pb: 2,
//             height: "100%",
//             overflow: "auto",
//             width: "340px"
//           }}
//         >
//           <br></br>
//           <DragDropContext>
//             <Droppable droppableId="droppable" onDragEnd={handleDragEnd}>
//               {(provided) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps}>
//                   {selectedLayers.map((item, index) => {
//                     <Draggable
//                       key={item.id}
//                       index={index}
//                       draggableId={item.id}
//                     >
//                       {(provided, snapshot) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           style={{
//                             // default item style
//                             padding: "8px 16px",
//                             // default drag style
//                             ...provided.draggableProps.style,
//                             // customized drag style
//                             background: snapshot.isDragging
//                               ? "pink"
//                               : "transparent"
//                           }}
//                         >
//                           <DraggableCard data={item} />;{"tetst"}
//                         </div>
//                       )}
//                     </Draggable>;
//                   })}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </StyledBox>
//         {/* </div> */}
//       </SwipeableDrawer>
//     </Root>
//   );
// }

// SwipeableEdgeDrawer.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window: PropTypes.func
// };

// export default SwipeableEdgeDrawer;
