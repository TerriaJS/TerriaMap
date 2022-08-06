import ReactDOM from "react-dom";
import RedBox from "redbox-react";
import React from "react";
import Variables from "../Styles/variables.scss";

export default function renderUi(terria, allBaseMaps, viewState) {
  let render = () => {
    const UI = require("./UserInterface").default;
    ReactDOM.render(
      <UI
        terria={terria}
        allBaseMaps={allBaseMaps}
        viewState={viewState}
        themeOverrides={Variables}
      />,
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
