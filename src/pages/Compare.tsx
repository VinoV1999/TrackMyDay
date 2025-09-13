import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spinner } from "../Components/ui/Spinner";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  brandColors,
  formatDate,
  secondsToTimeParts,
  timePartsToString,
} from "../utils/common";
import { UseTask } from "../context/TaskContext";
import { Task, TimeParts } from "../types/types";
import { CalendarIcon, RemoveIcon } from "../utils/Icons";
import SelectTaskFromList from "../Components/task/SelectTaskFromList";
import ToggleSwitch from "../Components/ui/ToggleSwitch";
import RadioButtons from "../Components/ui/RadioButtons";
import { TimeFormatType } from "../types/enums";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const yAxisLabel = {
  Hrs: {
    type: "hours" as keyof TimeParts,
    shortType: "Hrs",
    format: TimeFormatType.HR_MIN_SEC,
  },
  Mins: {
    type: "minutes" as keyof TimeParts,
    shortType: "Mins",
    format: TimeFormatType.MIN_SEC,
  },
  Secs: {
    type: "seconds" as keyof TimeParts,
    shortType: "Secs",
    format: TimeFormatType.SEC,
  },
};

function Compare() {
  const { fetchTaskDetails } = UseTask();
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [yAxisType, setYAxisType] = useState<keyof typeof yAxisLabel>("Mins");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [data, setData] = useState<{
    labels: string[];
    values: TimeParts[][];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const isValidDateRange = startDate && endDate && startDate <= endDate;
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  const fetchData = async () => {
    if (!startDate || !endDate || selectedTasks.length === 0) return;
    setLoading(true);
    try {
      // Example API call
      const res = await fetchTaskDetails(
        startDate,
        endDate,
        selectedTasks.map((t) => t.id)
      );

      if (!res) return;
      const labels = Object.keys(res);
      const values = Object.values(res).reduce(
        (acc: { [key: string]: TimeParts[] }, cur) => {
          const subKeys = Object.keys(cur);
          subKeys.forEach((key) => {
            const value = secondsToTimeParts(cur[key]);
            if (acc[key]) {
              acc[key].push(value);
            } else {
              acc[key] = [value];
            }
          });
          return acc;
        },
        {}
      );
      setData({ labels, values: Object.values(values) });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedTasks]);

  const chartData = {
    labels: data?.labels || [],
    datasets:
      data?.values.map((value, i) => ({
        label: selectedTasks[i]?.name || "data",
        data: value.map((v) => v[yAxisLabel[yAxisType].type]) || [],
        backgroundColor: value.map(
          (_, i) => brandColors[i % brandColors.length]
        ),
        borderColor: value.map(
          (_, i) => brandColors[i + (1 % brandColors.length)]
        ),
        fill: false,
      })) || [],
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
            return `${context.dataset.label}: ${context.raw} ${yAxisLabel[yAxisType].shortType}`;
          },
        },
      },
    },
  };

  console.log(data);

  return (
    <div className="flex flex-col gap-4 h-full w-[99%]">
      {/* Controls */}
      <div className="flex items-end justify-between gap-6 p-4 bg-white rounded shadow w-full">
        
        {/* Date Range Picker */}
        <div className="flex items-center justify-center h-full">
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            placeholderText="Select date range"
            showPopperArrow={false}
            popperPlacement="bottom-start"
            customInput={
              <button
                type="button"
                className="flex items-center gap-2 p-2 bg-brand-700 text-white rounded shadow hover:bg-brand-800 focus:outline-none"
              >
                <CalendarIcon className="w-5 h-5" color="#f5f3ff" />
              </button>
            }
          />
        </div>
        {/* Selected Tasks */}
        <div className="flex flex-col">
          <div className="flex justify-end md:justify-start flex-wrap gap-2">
            {selectedTasks.map((task) => (
              <div
                key={task.id}
                className="relative flex items-center gap-2 p-2 bg-brand-50 text-brand-700 rounded-lg shadow-sm group"
              >
                <span>{task.name}</span>
                <button
                  onClick={() =>
                    setSelectedTasks((prev) =>
                      prev.filter((t) => t.id !== task.id)
                    )
                  }
                  className="p-1 rounded-full hover:bg-brand-200 text-gray-600 hover:text-red-600"
                  aria-label="Remove task"
                >
                  <RemoveIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            {/* Task Name Input with Suggestions */}
            <SelectTaskFromList
              selectedTasks={selectedTasks}
              setSelectedTasks={setSelectedTasks}
              maxTasks={5}
            />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[calc(100vh-160px)] bg-white shadow rounded p-4 flex items-center justify-center relative group">
        {isValidDateRange && !loading && selectedTasks.length > 0 && (
          <div className="opacaty-0 group-hover:opacity-100 absolute top-4 right-4 flex gap-2 ">
            <RadioButtons
              options={Object.keys(yAxisLabel)}
              value={yAxisType}
              setValue={(val) => {
                setYAxisType(val as keyof typeof yAxisLabel);
              }}
            />
            <ToggleSwitch
              value={chartType === "line"}
              onChange={(val) => setChartType(val ? "line" : "bar")}
              leftLabel="Bar"
              rightLabel="Line"
            />
          </div>
        )}
        {!isValidDateRange || !selectedTasks.length ? (
          <p className="text-gray-400">Select start, end dates and tasks</p>
        ) : loading ? (
          <Spinner />
        ) : chartType === "line" ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}

export default Compare;
