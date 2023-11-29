import "./App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import "react-tabs/style/react-tabs.css";

import sankeyData from "./data/SankeyChart.json";
import lineData from "./data/LineChart.json";
import bubbleData from "./data/BubbleChart.json";
import wordcloudData from "./data/BubbleText.json";

import SankeyLine from "./charts/views/SankeyLine";
// import EmojiBubble from "./charts/views/EmojiBubble";
import ScrollableBubbleChart from "./charts/ScrollableBubble";
import BubbleText from "./charts/BubbleText";

function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabSelect = (index) => {
    setTabIndex(index);
  };

  return (
    <div>
      <Tabs selectedIndex={tabIndex} onSelect={handleTabSelect}>
        <TabList>
          <Tab>Seasonal Analysis</Tab>
          <Tab>Sentiment Analysis</Tab>
          <Tab>Keywords Analysis</Tab>
        </TabList>

        <TabPanel>
          <SankeyLine data={{ sankeyData, lineData }} />
        </TabPanel>

        <TabPanel>
          <ScrollableBubbleChart data={bubbleData} />
        </TabPanel>

        <TabPanel>
          <BubbleText data={wordcloudData} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
