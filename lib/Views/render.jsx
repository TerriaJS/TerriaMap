import { createRoot } from "react-dom/client";

import Variables from "../Styles/variables.scss";
import UI from "./UserInterface";

export default function renderUi(terria, allBaseMaps, viewState) {
  const container = document.getElementById("ui");
  const root = createRoot(container);

  root.render(
    <UI
      terria={terria}
      allBaseMaps={allBaseMaps}
      viewState={viewState}
      themeOverrides={Variables}
    />
  );
}
