import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { onSnapshot } from "firebase/firestore";
import { useState, useMemo, useEffect } from "react";
import { UserAuth } from "../context/authContext";
import TrackerServices from "../context/trackerServices";
import TimeCalculator from "../Functions/TimeCalculator";
import Loading from "./Loading";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import AmountCalculator from "../Functions/Amount"

export default function CompareEfforts() {
  const { user } = UserAuth();
  const [days, setDays] = useState(() => 0);
  const [dates, setDates] = useState(() => []);
  const [percent, setPercent] = useState(() => []);
  const [tasks, setTasks] = useState(() => []);
  const [timeWithPercent, setTimeWithPercent] = useState(() => []);
  const [classNameOfTask, setClassNameOfTask] = useState(() => []);
  const [selectedTask, setSelectedTask] = useState(() => "");
  const [isLoading, setIsLoading] = useState(() => false);
  const [totalHours, setTotalHours] = useState(() => "");
  const [isToolsBoxOpen, setIsToolsBoxOpen] = useState(() => false);
  const [amountPerHour, setAmountPerHour] = useState(() => 500);
  const [fromDate, setFromDate] = useState(()=> '');

  const titleText = `Totaly ${totalHours} of ${selectedTask} ${selectedTask.toLowerCase() === 'freelancing' ? 'Earned '+AmountCalculator.getAmountFromTime(amountPerHour, totalHours) : ''}`

  const getDatas = async () => {
    if (days > 1 && days <= 30 && selectedTask != "") {
      setIsLoading(true);
      const query = await TrackerServices.getNDaysTaskEffortQuery(
        user.uid,
        selectedTask,
        days
      );
      const data = { dates: [], percent: [], timeWithPercent: [] };
      let count = 0;
      const format = new Intl.DateTimeFormat("en-us");
      let today = format.format(new Date()).split("/").join("-");
      let date = TimeCalculator.getyesterday(today, count);
      let some = [];
      let totalHoursInPercent = 0;
      onSnapshot(query, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          some.shift(doc.id);
          while (days > count) {
            data.dates.push(date);
            count++;
            if (doc.id === date) {
              totalHoursInPercent += doc.data().percent;
              data.percent.push(doc.data().percent);
              data.timeWithPercent.push(
                TimeCalculator.percentToHrs(doc.data().percent) +
                  " - (" +
                  parseFloat(doc.data().percent).toFixed(2) +
                  "%)"
              );
              date = TimeCalculator.getyesterday(today, count);
              break;
            } else {
              data.percent.push(0);
              data.timeWithPercent.push(" 00 : 00 : 00 - (0%)");
              date = TimeCalculator.getyesterday(today, count);
            }
          }
        });
        while (days > count) {
          data.dates.push(date);
          data.percent.push(0);
          data.timeWithPercent.push(" 00 : 00 : 00 - (0%)");
          count++;
          date = TimeCalculator.getyesterday(today, count);
        }
        setDates(data.dates.reverse());
        setPercent(data.percent.reverse());
        setTimeWithPercent(data.timeWithPercent.reverse());
        setIsLoading(false);
        setTotalHours(TimeCalculator.percentToHrs(totalHoursInPercent));
      });
    }
  };
  useMemo(() => {
    if (days > 30) {
      setDays(30);
      return;
    } else getDatas();
  }, [days, selectedTask]);
  useEffect(() => {
    setIsLoading(true);
    getTasks();
  }, []);

  const getTasks = async () => {
    let tasks = await TrackerServices.getTasks(user.uid);
    if (tasks.data() !== undefined) {
      setTasks((preTask) => {
        const TASKSINDB = tasks.data().Tasks;
        preTask = TASKSINDB;
        setClassNameOfTask(() => {
          return new Array(preTask.length).fill("task");
        });
        return preTask;
      });
    }
    setIsLoading(false);
  };

  const handleClick = (i) => {
    setSelectedTask(tasks[i]);
    setClassNameOfTask(() => {
      let classArr = new Array(tasks.length).fill("task");
      classArr[i] = "task Active";
      return classArr;
    });
  };

  return (
    <div className="compareEfforts">
      {isLoading ? <Loading /> : <></>}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          y: 0,
          opacity: 1,
          width: isToolsBoxOpen ? "350px" : "43px",
          height: isToolsBoxOpen ? "400px" : "30px",
        }}
        transition={{
          ease: "easeInOut",
          delay: isToolsBoxOpen ? 0 : 0.3,
        }}
        className="inputContainer"
      >
        <div className="ToolsBoxControllerContainer">
          <motion.div
            initial={{
              x: 0,
            }}
            animate={{
              rotate: isToolsBoxOpen ? 0 : 180,
            }}
            transition={{
              ease: "easeInOut",
            }}
            className="ToolsBoxController"
          >
            <FontAwesomeIcon
              onClick={() => setIsToolsBoxOpen((prev) => !prev)}
              className="font-extrabold"
              icon={faAngleRight}
            />
          </motion.div>
        </div>
        <motion.div
          initial={{
            x: -100,
            opacity: 0,
          }}
          animate={{
            x: isToolsBoxOpen ? 0 : -100,
            opacity: isToolsBoxOpen ? 1 : 0,
          }}
          transition={{
            ease: "easeInOut",
            delay: isToolsBoxOpen ? 0.2 : 0,
            duration: 0.2,
          }}
          className="daysInput"
        >
          <div className="indInpContainer">
            <label className="inputLabels">Compare From</label>
            <div className="inputTextBox">
              <input
                style={{
                  width: "70%",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
                type="date"
                min={2}
                max={30}
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="indInpContainer">
            <label className="inputLabels">No. of Days to compare</label>
            <div className="inputTextBox">
              <input
                style={{
                  width: "70%",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
                type="number"
                min={2}
                max={30}
                value={days}
                onChange={(e) => {
                  setDays(e.target.value);
                }}
              />
            </div>
          </div>

          {selectedTask.toLowerCase() === "freelancing" && (
            <div className="indInpContainer">
              <label className="inputLabels">Amount Per Day</label>
              <div className="inputTextBox">
                <input
                  style={{
                    width: "70%",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                  }}
                  type="number"
                  min={1}
                  max={20000}
                  value={amountPerHour}
                  onChange={(e) => {
                    setAmountPerHour(e.target.value);
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
        <motion.div
          initial={{
            x: -100,
            opacity: 0,
          }}
          animate={{
            x: isToolsBoxOpen ? 0 : -100,
            opacity: isToolsBoxOpen ? 1 : 0,
          }}
          transition={{
            ease: "easeInOut",
            delay: isToolsBoxOpen ? 0.35 : 0.1,
          }}
          className="inputTasksContainer"
        >
          <div className="taskInput">
            {tasks.map((task, index) => {
              return (
                <div
                  key={index}
                  index={index}
                  onClick={() => handleClick(index)}
                  className={classNameOfTask[index]}
                >
                  {task}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
      <div className="charContainer">
        {days > 1 && selectedTask != "" && (
          <Line
            data={{
              labels: dates,
              datasets: [
                {
                  label: "Percent ",
                  data: percent,
                  borderWidth: 4,
                  borderColor: ["white"],
                  hoverBorderWidth: 5,
                  hoverBackgroundColor: "rgba(232,105,90,0.8)",
                  hoverBorderColor: "orange",
                  scaleStepWidth: 1,
                },
              ],
            }}
            height={400}
            width={700}
            options={{
              maintainAspectRatio: false,

              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "white",
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "white",
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  titleAlign: "center",
                  callbacks: {
                    label: function (t) {
                      return timeWithPercent[t.dataIndex];
                    },
                  },
                },
                title: {
                  display: true,
                  text: titleText,
                  color: "white",
                  font: {
                    size: 16,
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
