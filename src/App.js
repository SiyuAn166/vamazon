import './App.css';

// import Sankey from './charts/SankeyChart';
// import dSankey from './data/SankeyChart.json';


import D3Sankey from './charts/Sankey';
import d3Sankey from './data/Sankey.json';
import D3BubbleChart from './charts/Bubble';
import dBubble from './data/BubbleChart.json';
import BubbleText from './charts/BubbleText';
import tBubble from './data/BubbleText.json';

import XYBubble from './charts/XYBubble';


function App() {

  return (
    <div>
      {/* <Sankey data={dSankey.data} links={dSankey.links} /> */}
      <D3Sankey data={d3Sankey} />
      <D3BubbleChart data={dBubble} />
      <XYBubble data={dBubble}/>
      <BubbleText data={tBubble} />
    </div>

  );

}

export default App;
