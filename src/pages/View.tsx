import React, { useState, useMemo, useRef } from "react";
import TasksCalendar from "../Components/calender/DayTaskCalender";
import { UseTask } from "../context/TaskContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DayTasks } from "../types/types";
import { CalendarIcon, ClockIcon, FireIcon, TaskIcon, TodayIcon } from "../utils/Icons";

ChartJS.register(ArcElement, Tooltip, Legend);

const brandColors = [
  "#ddd6fe", // 4.
  "#d5cafe", // 5.
  "#c4b5fd", // 6.
  "#bca3fc", // 7.
  "#b191fa", // 8.
  "#a78bfa", // 9.
  "#9c7df7", // 10.
  "#8b5cf6", // 11.
  "#834af3", // 12.
  "#7c3aed", // 13.
  "#6d28d9", // 14.
  "#641fcf", // 15.
  "#5b21b6", // 16.
  "#4c1d95", // 17.
  "#3f187d", // 18.
  "#351267", // 19.
  "#2b0e50", // 20. darkest shade
];

const View: React.FC = () => {
  const { dayTasks } = UseTask();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calReg = useRef<DatePicker | null>(null);

  const filteredTasks = useMemo(() => {
    return dayTasks.filter((task) => {
      const taskDate = new Date(task.startAt);
      return (
        taskDate.getDate() === selectedDate.getDate() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [dayTasks, selectedDate]);

  const getDurationInSeconds = (task: DayTasks) => {
    const end = task.endAt ?? new Date();
    return (end.getTime() - task.startAt.getTime()) / 1000;
  };

  const totalTimeSeconds = filteredTasks.reduce(
    (acc, task) => acc + getDurationInSeconds(task),
    0
  );

  const highestTask = filteredTasks.reduce<DayTasks | null>((max, task) => {
    const duration = getDurationInSeconds(task);
    if (!max || duration > getDurationInSeconds(max)) return task;
    return max;
  }, null);

  const chartData = {
    labels: filteredTasks.map((task) => task.task.name),
    datasets: [
      {
        data: filteredTasks.map(getDurationInSeconds),
        backgroundColor: filteredTasks.map(
          (_, i) => brandColors[i % brandColors.length]
        ),
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#4b5563",
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const minutes = Math.floor(context.raw / 60);
            return `${context.label}: ${minutes} min`;
          },
        },
      },
    },
  };

  return (
    <div className="flex gap-4 h-screen  w-[99%]">
      {/* Left Half - Calendar */}
      <div className="w-1/2">
        <TasksCalendar date={selectedDate} />
      </div>

      {/* Right Half - Stats */}
      <div className="h-[calc(100vh-40px)] w-1/2 grid grid-cols-12 grid-rows-12">

        {/* Highest time-spent task */}
        <div className="col-span-11 row-span-2 border m-2 rounded-lg p-2 shadow bg-brand-100">
          <h2 className="text-lg font-semibold mb-2 flex gap-2 text-brand-700">
            <FireIcon className="w-6 h-6" color="#6d28d9" /> Most Focused
          </h2>
          <span className="flex gap-2 items-center">
            {highestTask ? (
              <>
                <p className="font-bold text-brand-700">
                  {highestTask.task.name}
                </p>
                <p>
                  {Math.floor(getDurationInSeconds(highestTask) / 60)}{" "}
                  mins
                </p>
              </>
            ) : (
              <p>No tasks found</p>
            )}
          </span>
        </div>

        {/* Date Picker */}
        <div onClick={() => calReg.current?.setFocus()} className="col-span-1 row-span-1 border m-2 rounded-lg bg-brand-700 shadow flex items-center justify-center cursor-pointer">
          <DatePicker
            ref={calReg}
            selected={selectedDate}
            onChange={(date: Date | null) =>
              setSelectedDate(date ?? new Date())
            }
            customInput={
              <button
                type="button"
                className="col-span-1 row-span-1 h-full w-full flex gap-2 items-center text-white rounded bg-brand-700"
              >
                <CalendarIcon className="w-5 h-5" color="#f5f3ff" />
              </button>
            }
            popperPlacement="bottom-start"
            showPopperArrow={false}
          />
        </div>

        <div onClick={() => setSelectedDate(new Date())} className="col-span-1 row-span-1 border m-2 rounded-lg bg-brand-700 shadow flex items-center justify-center cursor-pointer">
          <TodayIcon className="w-5 h-5 text-white" color="white" />
        </div>

        {/* Total Tasks Count on Selected Date */}
        <div className="col-span-6 row-span-2 border m-2 rounded-lg p-4 bg-brand-100 shadow">
          <h2 className="text-lg font-semibold mb-2 flex gap-2 text-brand-700">
            <TaskIcon className="w-6 h-6" color="#6d28d9" /> Total Tasks
          </h2>
          <span className="flex gap-2 items-center">
            <p className="text-brand-700 text-xl font-bold">
              {filteredTasks.length}
            </p>
            <p className="text-sm text-gray-600">
              on {selectedDate.toDateString()}
            </p>
          </span>
        </div>

        {/* Total time */}
        <div className="col-span-6 row-span-2 border m-2 rounded-lg p-2 shadow bg-brand-100">
          <h2 className="text-lg font-semibold mb-2 flex gap-2 text-brand-700">
            <ClockIcon className="w-6 h-6" color="#6d28d9" /> Total Time
          </h2>
          <span className="flex gap-2 items-center">
            <p>{Math.floor(totalTimeSeconds / 60)} minutes</p>
          </span>
        </div>

        {/* Pie Chart */}
        <div className="col-span-12 row-span-8 border m-2 rounded-lg p-4 shadow flex items-center justify-center">
          {filteredTasks.length ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <p className="text-brand-800">No tasks to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default View;
