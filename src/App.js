import "./App.css";
import * as d3 from "d3";

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
import { useEffect, useState } from "react";

function App() {
  let timeoutId;

  const [reviews, setReviews] = useState([]);

  const [selectedReviews, setSelectedReviews] = useState(reviews);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await d3.csv("http://localhost:5173/reviews.csv");
        setReviews(res);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  window.addEventListener("message", function (event) {
    try {
      const period = JSON.parse(event.data);

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setSelectedReviews(
          reviews.filter(
            (review) =>
              review.unixReviewTime >= period.fromValue &&
              review.unixReviewTime <= period.toValue
          )
        );
      }, 1000);
    } catch (e) {
      console.log("Message received from the child: " + event.data); // Message received from child
    }
  });

  return (
    <>
      <div className=" flex w-screen min-h-screen ">
        <div className="flex justify-center basis-1/2">
          <iframe src="http://localhost:5173/" width="100%" height={"100%"} />
        </div>
        <div
          className="flex flex-col basis-1/2 justify-between"
          key={selectedReviews.length}
        >
          <ScrollableBubbleChart data={makeDataForBubble(selectedReviews)} />
          <BubbleText data={makeDataForText(selectedReviews)} />
        </div>
      </div>
    </>
  );
}

export default App;
