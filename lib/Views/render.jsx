import ReactDOM from "react-dom";
import RedBox from "redbox-react";
import React from "react";
import Variables from "../Styles/variables.scss";
// import Collapsible from "../../custom-ui/collapsible";

// const Collapsible = (props) => {
//   return (
//     <div
//       style={{
//         zIndex: 100,
//         width: "800%",
//         marginLeft: "20%",
//         height: "20vh",
//         background: "red",
//         position: "fixed",
//         bottom: 0
//       }}
//     >
//       <h1>{props.name}</h1>
//     </div>
//   );
// };

export default function renderUi(terria, allBaseMaps, viewState) {
  let render = () => {
    const UI = require("./UserInterface").default;
    const Collapsible = require("./collapsible").default;
    ReactDOM.render(
      <div>
        <div
          style={{
            zIndex: 100,
            width: "10%",
            height: "80vh",
            background: "yellow",
            position: "fixed"
          }}
        >
          Icons Section
        </div>
        <div>
          <UI
            terria={terria}
            allBaseMaps={allBaseMaps}
            viewState={viewState}
            themeOverrides={Variables}
          />
        </div>
        <div
          style={{
            zIndex: 101,
            width: "20%",
            height: "20vh",
            background: "green",
            position: "fixed",
            bottom: 0
          }}
        >
          Selected Layer List
        </div>
        <Collapsible name={"Phil"} />
      </div>,
      document.getElementById("ui")
    );
  };

  if (module.hot && process.env.NODE_ENV !== "production") {
    // Support hot reloading of components
    // and display an overlay for runtime errors
    const renderApp = render;
    const renderError = (error) => {
      console.error(error);
      console.error(error.stack);
      ReactDOM.render(<RedBox error={error} />, document.getElementById("ui"));
    };
    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };
    module.hot.accept("./UserInterface", () => {
      setTimeout(render);
    });
  }

  render();
}
