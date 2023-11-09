import React from "react";
import Sankey from "../SankeyChart";
import LineeChart from "../LineeChart";

function SankeyLine({ data: { sankeyData, lineData } }) {
  return (
    <div style={{ margin: "5rem" }}>
      <Sankey data={sankeyData} />
      <LineeChart data={lineData} />
    </div>
  );
}

export default SankeyLine;
