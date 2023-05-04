import { Box, Card, Chip, Divider } from "@mui/material";
import { useLayers } from "../context";
import React from "react";

//

const keysToExtract = [
  "id",
  "name",
  "opacity",
  "color",
  "date",
  "cycle",
  "grid",
  "advisory",
  "stormName",
  "instance"
];

export const BaseMap = () => {
  const {
    visibleLayers,
    activeLayerId,
    setActiveLayerId,
    activeLayerDatasets,
    toggleActiveLayerDataset
  } = useLayers();

  const handleClickDataset = (datasetIndex) => () => {
    toggleActiveLayerDataset(datasetIndex);
  };

  return (
    <Card
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
        backgroundColor: "#eee",
        whiteSpace: "pre-wrap",
        m: 0,
        height: "100%",
        "::before": {
          position: "absolute",
          top: "33%",
          left: "50%",
          transform: "translate3d(-50%, -50%, 0)",
          width: "100%",
          height: "100%",
          content: '"MAP"',
          fontSize: "clamp(100px, 33vw, 700px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#0001"
        },
        ".layer": {
          position: "absolute",
          top: "15%",
          left: "25%",
          border: "solid #444",
          transition: "transform 250ms, border-color 250ms",
          cursor: "pointer",
          "&:hover": {
            borderColor: "crimson"
          },
          ".info": { p: 1 },
          ".datasets": {
            p: 1,
            maxWidth: "400px",
            textAlign: "center",
            ".MuiChip-root": { p: 0.5, m: 0.25 }
          }
        }
      }}
    >
      {visibleLayers
        .sort((l, m) => m.order - l.order)
        .map((layer, i) => (
          <Box
            key={`map-layer-${layer.id}`}
            onClick={() => setActiveLayerId(layer.id)}
            className="layer"
            sx={{
              filter: `opacity(${layer.opacity})`,
              backgroundColor: layer.color,
              transform: `perspective(1000px) translate3d(${(i + 1) * 3}rem, ${
                (i + 1) * 2
              }rem, 0) rotateX(-30deg) rotateY(30deg)`
            }}
          >
            <pre className="info">
              {JSON.stringify(layer, keysToExtract, 2)}
            </pre>
            <Divider />
            <Box className="datasets">
              {layer.data.map((dataset, i) => (
                <Chip
                  key={`layer-${layer.id}-dataset-${i}`}
                  label={i}
                  color={
                    activeLayerId === layer.id &&
                    activeLayerDatasets.includes(i)
                      ? "primary"
                      : "default"
                  }
                  onClick={handleClickDataset(i)}
                />
              ))}
            </Box>
          </Box>
        ))}
    </Card>
  );
};

// { JSON.stringify(layer, ['id', 'name', 'opacity', 'date', 'cycle', 'grid', 'advisory', 'stormName', 'instance' ], 2) }
