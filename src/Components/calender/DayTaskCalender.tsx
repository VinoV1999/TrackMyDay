import React, { use, useEffect, useState } from "react";
import { dateTitle } from "../../utils/common";
import ToggleSwitch from "../ui/ToggleSwitch";
import { UseTask } from "../../context/TaskContext";
import { DayTasks } from "../../types/types";
import { ChartIcon, ClockIcon, EndIcon, StartIcon } from "../../utils/Icons";


const TasksCalendar: React.FC<{date: Date}> = ({date}) => {
  const { dayTasks, fetchDayTasks } = UseTask();
  const [selectedTask, setSelectedTask] = useState<DayTasks | null>(null);
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    fetchDayTasks(date);
  }, [date]);

  const formatHourLabel = (h: number) => {
    if (is24Hour) return `${h.toString().padStart(2, "0")}:00`;

    const period = h < 12 ? "AM" : "PM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12} ${period}`;
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");

    if (is24Hour) {
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    } else {
      const period = hours < 12 ? "AM" : "PM";
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      return `${hour12}:${minutes} ${period}`;
    }
  };

  const getDurationInfo = (task: DayTasks) => {
    const end = task.endAt || new Date();
    const diffMs = end.getTime() - task.startAt.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    const percent = ((diffMs / (1000 * 60 * 60 * 24)) * 100).toFixed(2);

    return {
      duration: `${hours}h ${minutes}m ${seconds}s`,
      percent,
    };
  };

  return (
    <div className="w-full h-[calc(100vh-40px)] bg-light rounded-xl shadow border border-brand-100 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-brand-700">
          {dateTitle(date)}
        </h2>
        <ToggleSwitch value={is24Hour} onChange={setIs24Hour} leftLabel="AM/PM" rightLabel="24h" />
      </div>

      <div className="grid grid-cols-[60px_1fr] gap-4 relative">
        {/* Left column: Hours */}
        <div className="flex flex-col text-sm text-gray-500">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-16 border-t border-gray-200">
              {formatHourLabel(i)}
            </div>
          ))}
        </div>

        {/* Right column: Calendar + tasks */}
        <div className="relative">
          {/* Hour lines */}
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="h-16 border-t border-gray-200"></div>
          ))}

          {/* Render tasks */}
          {dayTasks.map((task, idx) => {
            const startHour =
              task.startAt.getHours() + task.startAt.getMinutes() / 60;
            const endHour = task.endAt
              ? task.endAt.getHours() + task.endAt.getMinutes() / 60
              : new Date().getHours() + new Date().getMinutes() / 60;

            const top = startHour * 4 + "rem"; // 1hr = 4rem
            const height = (endHour - startHour) * 4 + "rem";

            return (
              <div
                key={idx}
                className="absolute left-2 right-2 bg-brand-400 text-light p-2 rounded-lg shadow cursor-pointer hover:bg-brand-500"
                style={{ top, height }}
                onClick={() => setSelectedTask(task)}
              >
                <span className="font-semibold">{task.task.name}</span>
                <div className="text-xs">
                  {formatTime(task.startAt)} →{" "}
                  {task.endAt ? formatTime(task.endAt) : "In Progress"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup modal */}
      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-light rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-brand-700 mb-4">
              {selectedTask.task.name}
            </h3>
            <p className="flex gap-2 items-center mb-2">
              <ClockIcon className="w-6 h-6" color="#6d28d9" /> Duration:{" "}
              <span className="font-mono">
                {getDurationInfo(selectedTask).duration}
              </span>
            </p>
            <p className="flex gap-2 items-center mb-2">
              <ChartIcon className="w-6 h-6" color="#6d28d9" /> Day Usage:{" "}
              <span className="font-bold text-brand-600">
                {getDurationInfo(selectedTask).percent}%
              </span>
            </p>
            <p className="flex gap-2 items-center mb-2">
              <StartIcon className="w-6 h-6" color="#6d28d9" /> Start:{" "}
              <span className="font-mono">
                {formatTime(selectedTask.startAt)}
              </span>
            </p>
            <p className="flex gap-2 items-center mb-2">
              <EndIcon className="w-6 h-6" color="#6d28d9" /> End:{" "}
              {selectedTask.endAt ? (
                <span className="font-mono">
                  {formatTime(selectedTask.endAt)}
                </span>
              ) : (
                <span className="text-brand-600">In Progress</span>
              )}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-brand-500 text-light rounded-lg hover:bg-brand-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksCalendar;
