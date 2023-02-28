import React from "react";
import LayersIcon from "./icon";

export default function IconSection() {
  return (
    <div
      style={{
        zIndex: 100,
        height: "80vh",
        position: "fixed"
      }}
    >
      <ul
        style={{
          background: "rgb(0 0 0 / 36%)",
          padding: "14px 0px 3px 0",
          marginLeft: "20px",
          borderRadius: "18px"
        }}
      >
        {[{ name: "ADCIRC" }, { name: "EC FLOW" }].map((layer) => {
          return <LayersIcon title={layer.name} />;
        })}
      </ul>
    </div>
  );
}
