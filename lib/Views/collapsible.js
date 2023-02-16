import React from "react";

export default function Collapsible(props) {
  const [open, setOPen] = React.useState(false);

  const toggle = () => {
    setOPen(!open);
  };

  return (
    <div
      style={{
        zIndex: 100,
        width: "800%",
        marginLeft: "20%",
        height: "20vh",
        background: "red",
        position: "fixed",
        bottom: 0
      }}
    >
      <button onClick={toggle}>toggle</button>

      {open && <h1>{props.name}</h1>}
    </div>
  );
}
