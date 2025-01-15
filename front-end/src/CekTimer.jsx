import React, { useEffect, useState } from "react";

function CekTimer() {
  const [time, setTime] = useState(10);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      return clearInterval(timer), console.log("testing");
    };
  });

  const handleStart = () => {
    if (time > 0) setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(10);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold">Countdown Timer</h1>
      <div className="text-4xl my-5">{time}s</div>
      <div className="flex gap-2">
        <button
          onClick={handleStart}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default CekTimer;
