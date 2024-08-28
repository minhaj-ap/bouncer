import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  let prevValue = 3;
  const [blocks, setBlocks] = useState(
    Array(3)
      .fill(0)
      .map(() => {
        const randomValue = generateRandom(prevValue);
        prevValue = randomValue;
        return randomValue;
      })
  );
  const [scrolling, setScrolling] = useState(false);
  const containerRef = useRef(null);
  function generateRandom(prev) {
    let result;
    const values = [3, 4, 5, 6];
    do {
      result = values[Math.floor(Math.random() * values.length)];
    } while (result === prev);
    return result;
  }
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
            console.log(
              blocks[blocks.length],
              blocks[blocks.length - 1],
              blocks
            );
            setBlocks((prevBlocks) => [
              ...prevBlocks,
              generateRandom(prevBlocks[prevBlocks.length - 1]),
            ]);
          }
        }
      }, 16);
    }
    return () => clearInterval(intervalId);
  }, [scrolling]);

  return (
    <>
      <main ref={containerRef}>
        <div className="controller">
          {!scrolling ? (
            <div className="play">
              <button onClick={() => setScrolling(!scrolling)}>Play</button>
            </div>
          ) : (
            <div className="play">
              <button onClick={() => setScrolling(!scrolling)}>Stop</button>
            </div>
          )}
        </div>
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
    </>
  );
}

export default App;
