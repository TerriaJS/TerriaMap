import React, { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const LayersContext = createContext({});

export const useLayers = () => useContext(LayersContext);

export const LayersProvider = ({ children }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [layers, setLayers] = useState([{ name: "default" }]);
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [panel, setPanel] = useState("");
  const [activeLayerDatasets, setActiveLayerDatasets] = useState([]);
  // Terria Viewstate's WebMapCatalogItems
  const [webMapCatalogItems, setWebMapCatalogItems] = useState([]);
  // Terria Viewstate
  const [contextViewState, setContextViewState] = useState([]);
  // Catalog from API
  const [catalogFromApi, setCatalogFromApi] = useState([]);
  // Selected catalog items from API
  const [layerSelection, setLayerSelection] = useState({});
  // Activate Layer when clicked in the drawer
  const [activatedLayer, setActivatedLayer] = useState(null);
  // An array with the color scale params for each layer in the list
  const [activatedLayerParams, setActivatedLayerParams] = useState([]);
  // The color scale params for the activated layer
  const [activeLayerParams, setActiveLayerParams] = useState([0, 0]);
  const [checkedLayers, setCheckedLayers] = useState([]);

  // layer selection in API catalog (match.js)
  const layerIsSelected = (layerId) => layerId in layerSelection;
  const toggleLayerSelection = (layerId) => {
    let newLayerSelection = { ...layerSelection };
    if (layerIsSelected(layerId)) {
      delete newLayerSelection[layerId];
    } else {
      const newlySelectedLayer = layers.find((layer) => layer.id === layerId);
      // notice the additional properties we're
      // tacking onto selected layer objects.
      const layerProperties = {
        order: Object.keys(newLayerSelection).length,
        visible: true,
        opacity: 1.0
      };
      newLayerSelection[layerId] = {
        ...newlySelectedLayer,
        ...layerProperties
      };
    }
    setLayerSelection({ ...newLayerSelection });
  };

  // layer activity
  const activeLayer = useMemo(() => {
    setActiveLayerDatasets([]);
    return layerSelection?.[activeLayerId];
  }, [activeLayerId]);

  const toggleActiveLayerDataset = (datasetIndex) => {
    const newDatasetIndices = new Set([...activeLayerDatasets]);
    if (newDatasetIndices.has(datasetIndex)) {
      newDatasetIndices.delete(datasetIndex);
    } else {
      newDatasetIndices.add(datasetIndex);
    }
    setActiveLayerDatasets([...newDatasetIndices]);
  };

  // layer visibility
  const layerIsVisible = (layerId) =>
    layerIsSelected(layerId) && layerSelection?.[layerId]?.visible;
  const toggleLayerVisibility = (layerId) => {
    let newLayerSelection = { ...layerSelection };
    if (!(layerId in newLayerSelection)) {
      return;
    }
    newLayerSelection[layerId].visible = !newLayerSelection[layerId].visible;
    setLayerSelection({ ...newLayerSelection });
  };
  const visibleLayers = useMemo(() => {
    return Object.values(layerSelection).filter((layer) =>
      layerIsVisible(layer.id)
    );
  }, [layerSelection]);

  // layer order
  const swapLayers = (layerId1, layerId2) => {
    let newLayerSelection = { ...layerSelection };
    const tempOrder = newLayerSelection[layerId1].order;
    newLayerSelection[layerId1].order = newLayerSelection[layerId2].order;
    newLayerSelection[layerId2].order = tempOrder;
    setLayerSelection({ ...newLayerSelection });
  };

  // opacity
  const getLayerOpacity = (layerId) => {
    return layerSelection?.[layerId]?.opacity ?? "1.0";
  };

  const setLayerOpacity = (layerId, newOpacity) => {
    const newLayerSelection = { ...layerSelection };
    if (!(layerId in newLayerSelection)) {
      return;
    }
    newLayerSelection[layerId].opacity = newOpacity;
    setLayers({ ...newLayerSelection });
  };

  return (
    <LayersContext.Provider
      value={{
        activeLayerParams,
        setActiveLayerParams,
        activatedLayerParams,
        setActivatedLayerParams,
        catalogFromApi,
        setCatalogFromApi,
        activatedLayer,
        setActivatedLayer,
        contextViewState,
        setContextViewState,
        webMapCatalogItems,
        setWebMapCatalogItems,
        layers,
        visibleLayers,
        layerIsVisible,
        toggleLayerVisibility,
        activeLayer,
        activeLayerId,
        setActiveLayerId,
        activeLayerDatasets,
        toggleActiveLayerDataset,
        getLayerOpacity,
        setLayerOpacity,
        swapLayers,
        layerSelection,
        setLayerSelection,
        layerIsSelected,
        toggleLayerSelection,
        setLayers,
        setPanel,
        panel,
        currentTabIndex,
        setCurrentTabIndex,
        checkedLayers,
        setCheckedLayers
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};
