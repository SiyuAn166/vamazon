import "./App.css";

// import sankeyData from "./data/SankeyChart.json";
// import lineData from "./data/LineChart.json";
// import bubbleData from "./data/BubbleChart.json";
// import wordcloudData from "./data/BubbleText.json";
// import SankeyLine from "./charts/views/SankeyLine";
// import EmojiBubble from "./charts/views/EmojiBubble";

import rawdata from "./data/reviews.json";
import { makeDataForBubble, makeDataForText } from "./dataproc";

import ScrollableBubbleChart from "./charts/ScrollableBubble";
import BubbleText from "./charts/BubbleText";

function App() {
  window.addEventListener("message", function (event) {
    try {
      console.log(JSON.parse(event.data));
    } catch (e) {
      console.log("Message received from the child: " + event.data); // Message received from child
    }
  });

  return (
    <>
      <div className=" flex w-screen min-h-screen px-10 py-5">
        <div className="flex justify-center basis-1/2">
          <iframe src="http://localhost:5173/" width="100%" height={"100%"} />
        </div>
        <div className="flex flex-col basis-1/2 justify-between">
          <ScrollableBubbleChart data={makeDataForBubble(rawdata)} />
          <BubbleText data={makeDataForText(rawdata)} />
        </div>
      </div>
    </>
  );
}

export default App;
