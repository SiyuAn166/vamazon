import "./App.css";

import sankeyData from "./data/SankeyChart.json";
import lineData from "./data/LineChart.json";
import bubbleData from "./data/BubbleChart.json";
import wordcloudData from "./data/BubbleText.json";

import SankeyLine from "./charts/views/SankeyLine";
// import EmojiBubble from "./charts/views/EmojiBubble";
import ScrollableBubbleChart from "./charts/ScrollableBubble";
import BubbleText from "./charts/BubbleText";

function App() {
  return (
    <div>
      <SankeyLine data={{ sankeyData: sankeyData, lineData: lineData }} />
      {/* <EmojiBubble data={{ emojiBubbleData: bubbleData }} /> */}
      <ScrollableBubbleChart data={bubbleData} />
      <BubbleText data={wordcloudData} />
    </div>
  );
}

export default App;
