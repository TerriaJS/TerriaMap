import React, { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

export const LayersContext = createContext({});

export const useLayers = () => useContext(LayersContext);

export const LayersProvider = ({ children }) => {
  const [layers, setLayers] = useState([{ name: "default" }]);
  const [activatedLayer, setActivatedLayer] = useState(null);
  const [layerSelection, setLayerSelection] = useState({});
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [panel, setPanel] = useState("");
  const [activeLayerDatasets, setActiveLayerDatasets] = useState([]);

  // layer selection
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
        layers,
        activatedLayer,
        setActivatedLayer,
        setPanel,
        panel
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};

LayersProvider.propTypes = {
  children: PropTypes.node
};
