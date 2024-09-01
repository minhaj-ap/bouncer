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
  const [bottomGap, setBottomGap] = useState(blocks[0] * 5 + 1);
  const [scrolling, setScrolling] = useState(false);
  const [widths, setWidths] = useState([]);
  const [failed, setFailed] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const playerRef = useRef(null);
  const blocksRef = useRef([]);
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
    if (scrolling) {
      intervalRef.current = setInterval(() => {
        DecreseHeight();
      }, 500); // Decrease height every 500ms
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current); // Clean up on unmount
  }, [scrolling]);
  useEffect(() => {
    if (bottomGap <= 0 && !failed) {
      console.log("triggered123");
      setScrolling(false);
      console.log("failed");
      setFailed(true);
      setBlocks(
        Array(3)
          .fill(0)
          .map(() => {
            const randomValue = generateRandom(prevValue);
            // eslint-disable-next-line
            prevValue = randomValue;
            return randomValue;
          })
      );
      // This will reset the scroll
      containerRef.current.scrollTo(0, 0);
    }
  }, [bottomGap, blocks]);
  useEffect(() => {
    if (failed) {
      setBottomGap(blocks[0] * 5 + 1);
      setFailed(false);
    }
  }, [blocks, failed]);
  useEffect(() => {
    const playerRect = playerRef.current.getBoundingClientRect();
    blocksRef.current.forEach((blockRef, index) => {
      const blockRect = blockRef.getBoundingClientRect();

      // Check if the block has passed the player on the x-axis
      if (blockRect.right < playerRect.left) {
        console.log("A block has passed the player index=", index);
        console.log(playerRect, blockRect);
      }
    });
  }, [blocks, bottomGap]);

  useEffect(() => {
    // Generate widths only for new blocks that don't have a width yet
    if (widths.length < blocks.length) {
      const newWidths = blocks
        .slice(widths.length) // Only process new blocks
        .map((x) => generateRandom(x));

      setWidths((prev) => [...prev, ...newWidths]);
    }
  }, [blocks, widths]);

  function increaseHeight() {
    setBottomGap((prev) => (prev += 5));
  }
  function DecreseHeight() {
    setBottomGap((prev) => Math.max((prev -= 2), 0));
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
          <button className="up" onClick={() => increaseHeight()}>
            HIGH!!!
          </button>
        )}
        <span
          className="player"
          ref={playerRef}
          style={{ bottom: `${bottomGap}rem` }}
        ></span>
        <div className="blocks">
          {blocks.map((x, index) => {
            return (
              <div
                key={index}
                ref={(el) => (blocksRef.current[index] = el)}
                className={`block ${index === 0 ? "first-block" : ""}`}
                style={{
                  height: `${x * 5}rem`,
                  width: `${widths[index] * 3}rem`,
                }}
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
