import React from "react";
import D3BubbleChart from "../Bubble";
import XYBubble from "../XYBubble";

function EmojiBubble({ data: { emojiBubbleData } }) {
  return (
    <div>
      <D3BubbleChart data={emojiBubbleData} />
      <XYBubble data={emojiBubbleData} />
    </div>
  );
}

export default EmojiBubble;
