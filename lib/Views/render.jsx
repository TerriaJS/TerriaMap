import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import Variables from "../Styles/variables.scss";
import UI from "./UserInterface";

export default function renderUi(terria, allBaseMaps, viewState) {
  const container = document.getElementById("ui");
  const root = createRoot(container);

  // Ensure that the initial render is synchronous so there is no a white flash visible between loading and rendering
  flushSync(() =>
    root.render(
      <UI
        terria={terria}
        allBaseMaps={allBaseMaps}
        viewState={viewState}
        themeOverrides={Variables}
      />
    )
  );
}
