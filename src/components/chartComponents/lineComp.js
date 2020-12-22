import React from "react";
import { ResponsiveLine } from "@nivo/line";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export default function MyResponsiveLine(props) {
  return (
    <ResponsiveLine
      width={900}
      height={400}
      animate={true}
      margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
      data={[
        {
          id: "fake corp. A",
          data: [
            { x: "2018-01-04 4:30:2", y: 13 },
            { x: "2018-01-04 6:30:2", y: 7 },
            { x: "2018-01-04 7:30:2", y: 5 },
            { x: "2018-01-04 8:30:2", y: 11 },
            { x: "2018-01-04 9:30:2", y: 9 },
            { x: "2018-01-04 10:30:2", y: 12 },
            { x: "2018-01-04 11:4:2", y: 16 },
            { x: "2018-01-04 12:00:2", y: 13 },
          ],
        },
        {
          id: "fake corp. B",
          data: [
            { x: "2018-01-04 1:30:2", y: 14 },
            { x: "2018-01-04 2:30:2", y: 14 },
            { x: "2018-01-04 3:30:2", y: 15 },
            { x: "2018-01-04 4:30:2", y: 11 },
            { x: "2018-01-04 5:30:2", y: 10 },
            { x: "2018-01-04 6:30:2", y: 12 },
            { x: "2018-01-04 7:30:2", y: 9 },
            { x: "2018-01-04 8:30:2", y: 7 },
          ],
        },
      ]}
      xScale={{
        type: "time",
        format: "%Y-%m-%d %H:%M:%S",
        useUTC: false,
        precision: "second",
      }}
      xFormat="time:%Y-%m-%d %H:%M:%S"
      yScale={{
        type: "linear",
        stacked: false,
      }}
      axisLeft={{
        legend: "linear scale",
        legendOffset: 12,
      }}
      axisBottom={{
        format: "%H:%S",
        tickValues: "every 1 hour",
        legend: "time scale",
        legendOffset: -12,
      }}
      curve="monotoneX"
      enablePointLabel={true}
      // pointSymbol={CustomSymbol}
      pointSize={16}
      pointBorderWidth={1}
      pointBorderColor={{
        from: "color",
        modifiers: [["darker", 0.3]],
      }}
      useMesh={true}
      enableSlices={false}
    />
  );
}
