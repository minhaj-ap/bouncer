import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [blocks, setBlocks] = useState(
    Array(9)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6 + 1))
  );
  console.log(blocks);
  const [scrolling, setScrolling] = useState(true);
  const containerRef = useRef(null);
  useEffect(() => {
    let intervalId;
    if (scrolling) {
      intervalId = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollLeft += 2;
          if (
            containerRef.current.scrollLeft +
              containerRef.current.clientWidth >=
            containerRef.current.scrollWidth
          ) {
            setBlocks((prevBlocks) => [
              ...prevBlocks,
              Math.floor(Math.random() * 6 + 1),
            ]);
          }
        }
      }, 16); // Roughly 60 frames per second
    }
    return () => clearInterval(intervalId);
  }, [scrolling]);

  return (
    <>
      <main ref={containerRef}>
        <div className="blocks">
          {blocks.map((x, index) => {
            return (
              <div
                key={index}
                className="block"
                style={{ height: `${x * 5}rem` }}
              ></div>
            );
          })}
        </div>
      </main>
      <div className="controller">
        <button onClick={() => setScrolling(!scrolling)}>scroll</button>
      </div>
    </>
  );
}

export default App;
