import React from "react";
import { ResponsiveBar } from "@nivo/bar";

export default function BarComp(props) {
  return (
    <>
      <h1>Bar</h1>
      <div style={{ height: 1000 }}>
        <ResponsiveBar
          data={props.data}
          keys={["radius"]}
          indexBy="geofenceName"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.15}
          groupMode="grouped"
        />
      </div>
    </>
  );
}
