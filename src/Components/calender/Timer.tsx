import React, { useEffect, useState } from "react";
import { UseTask } from "../../context/TaskContext";

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return [
    hrs.toString().padStart(2, "0"),
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
};

const Timer: React.FC = () => {
  const { activeTask, saveActiveTask, cancleAutoCutOff } = UseTask();
  const [elapsed, setElapsed] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Track autoCutOff timer ref
  const [autoCutoffTimer, setAutoCutoffTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Ticking clock
  useEffect(() => {
    if (!activeTask?.startAt) return;
    const startTime = new Date(activeTask.startAt).getTime();

    // check if cutoff enabled
    let endTime: number | null = null;
    if (activeTask.autoCutOff && activeTask.task.autoEndIn) {
      const { hours = 0, minutes = 0, seconds = 0 } = activeTask.task.autoEndIn;
      const cutoffMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
      if (cutoffMs > 0) {
        endTime = startTime + cutoffMs;
      }
    } else {
      setTimeLeft(0);
    }

    const tick = () => {
      const now = Date.now();

      // elapsed always
      const diff = now - startTime;
      setElapsed(diff);

      // timeLeft only if cutoff exists
      if (endTime) {
        const left = endTime - now;
        setTimeLeft(left > 0 ? left : 0);

        if (left <= 0) {
          saveActiveTask(undefined);
        }
      }
    };

    // run once immediately
    tick();

    // run every second
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [activeTask, saveActiveTask]);

  // AutoCutOff watcher
  useEffect(() => {
    if (!activeTask?.autoCutOff) return;

    const {
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = activeTask.task.autoEndIn || {};
    const cutoffMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (cutoffMs <= 0) return;

    const timer = setTimeout(() => {
      saveActiveTask(undefined);
    }, cutoffMs);

    setAutoCutoffTimer(timer);

    return () => clearTimeout(timer);
  }, [activeTask, saveActiveTask]);

  const handleStop = () => {
    saveActiveTask(undefined);
  };

  const cancelAutoCutoff = () => {
    if (autoCutoffTimer) clearTimeout(autoCutoffTimer);
    cancleAutoCutOff();

  };

  if (!activeTask) {
    return (
      <div className="bg-brand-600 text-light rounded-xl shadow p-6 flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold">No Active Task</h2>
        <p className="text-sm">Start a task to begin tracking.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-600 text-light rounded-xl shadow p-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl md:text-xl font-bold mb-2">Active Task</h2>
      <p className="text-lg md:text-sm mb-4 opacity-90">{activeTask.task.name}</p>

      <div className="text-8xl md:text-6xl font-mono">{formatTime(elapsed)}</div>

      <button
        onClick={handleStop}
        className="mt-3 px-5 py-2 text-xl md:text-md bg-brand-400 text-light rounded-xl hover:bg-brand-500 transition"
      >
        Stop
      </button>
      {/* AutoCutOff Hint */}
      {activeTask.autoCutOff && timeLeft !== null && timeLeft > 0 && (
        <div className="mt-4 flex items-center gap-2 bg-brand-500/40 px-3 py-1 rounded-lg text-lg md:text-sm">
          <span>Ends in {formatTime(timeLeft)}</span>
          <button
            onClick={cancelAutoCutoff}
            className="text-red-400 md:text-gray-400 hover:text-red-400 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
