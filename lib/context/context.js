import { createContext } from "react";

export const Context = createContext({
  selectedLayers: [],
  setSelectedLayers: () => {},
  layers: "test",
  setLayerData: () => {}
});
