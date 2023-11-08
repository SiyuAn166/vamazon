import './App.css';

// import D3Sankey from './charts/Sankey';
// import d3Sankey from './data/Sankey.json';


import Sankey from './charts/SankeyChart';
import dSankey from './data/SankeyChart.json';
import LineeChart from './charts/LineeChart';
import dLinee from './data/LineChart.json';
import D3BubbleChart from './charts/Bubble';
import dBubble from './data/BubbleChart.json';
import BubbleText from './charts/BubbleText';
import tBubble from './data/BubbleText.json';
import XYBubble from './charts/XYBubble';


function App() {

  return (
    <div>
      {/* <D3Sankey data={d3Sankey} /> */}
      <Sankey data={dSankey} />
      <LineeChart data={dLinee} />
      <D3BubbleChart data={dBubble} />
      <XYBubble data={dBubble}/>
      <BubbleText data={tBubble} />
    </div>

  );

}

export default App;
