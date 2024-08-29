import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // Giving 3 as initial value makes sure the block
  // doens't have small values at first.
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
  // The bottom gap of the block changes on sound
  const [bottomGap, setBottomGap] = useState(blocks[0] * 5);
  const [scrolling, setScrolling] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
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
              generateRandom(prevBlocks[prevBlocks.length - 1]),
            ]);
          }
        }
      }, 16);
    }
    return () => clearInterval(intervalId);
  }, [scrolling]);
  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      const handleMouseDown = (e) => {
        console.log("triggered");
        increaseHeight();
      };

      button.addEventListener("mousedown", handleMouseDown);

      // Clean up the event listener on component unmount
      return () => {
        button.removeEventListener("mousedown", handleMouseDown);
      };
    }
  }, [bottomGap]);
  function increaseHeight() {
    setBottomGap((prev) => (prev += 5));
  }
  function DecreseHeight() {
    setBottomGap((prev) => (prev -= 5));
  }
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
        {scrolling && (
          <>
            <button
              className="up"
              onClick={() => increaseHeight}
              ref={buttonRef}
            >
              HIGH!!!
            </button>
            <button
              className="up"
              style={{ top: "10%" }}
              onClick={DecreseHeight}
            >
              Down
            </button>
          </>
        )}
        <span
          className="player"
          style={{ bottom: `${bottomGap + 1}rem` }}
        ></span>
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

function generateRandom(prev) {
  let result;
  const values = [3, 4, 5, 6];
  do {
    result = values[Math.floor(Math.random() * values.length)];
  } while (result === prev);
  return result;
}
