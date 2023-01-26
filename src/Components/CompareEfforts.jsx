import React from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { onSnapshot } from 'firebase/firestore';
import { useState, useMemo, useEffect } from "react";
import { UserAuth } from '../context/authContext';
import TrackerServices from "../context/trackerServices";
import TimeCalculator from "../Functions/TimeCalculator";
import Loading from "./Loading";

export default function CompareEfforts() {
    const { user } = UserAuth();
    const [days, setDays] = useState(() => 0);
    const [dates, setDates] = useState(() => []);
    const [percent, setPercent] = useState(() => []);
    const [tasks, setTasks] = useState(() => []);
    const [timeWithPercent, setTimeWithPercent] = useState(() => []);
    const [classNameOfTask, setClassNameOfTask] = useState(() => []);
    const [selectedTask, setSelectedTask] = useState(() => '');
    const [isLoading, setIsLoading] = useState(()=>false);

    const getDatas = async () => {
        if (days > 1 && days <= 30 && selectedTask != '') {
            setIsLoading(true);
            const query = await TrackerServices.getNDaysTaskEffortQuery(user.uid, selectedTask, days);
            const data = { dates: [], percent: [], timeWithPercent: [] }
            let count = 0;
            let today = new Date().toLocaleDateString().split('/').join('-');
            let date = TimeCalculator.getyesterday(today, count);
            let some = [];
            onSnapshot(query, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    some.shift(doc.id);
                    while (days > count) {
                        data.dates.push(date);
                        console.log(date, doc.id, doc.id == date, doc.id === date, count);
                        count++;
                        if (doc.id === date) {
                            data.percent.push(doc.data().percent);
                            data.timeWithPercent.push(TimeCalculator.percentToHrs(doc.data().percent) + ' - (' + doc.data().percent + '%)')
                            date = TimeCalculator.getyesterday(today, count);
                            break;
                        } else {
                            data.percent.push(0)
                            data.timeWithPercent.push(' 00 : 00 : 00 - (0%)')
                            date = TimeCalculator.getyesterday(today, count);
                        }
                    }
                });
                while (days > count) {
                    data.dates.push(date);
                    data.percent.push(0);
                    data.timeWithPercent.push(' 00 : 00 : 00 - (0%)')
                    count++;
                    console.log(count - 1)
                    date = TimeCalculator.getyesterday(today, count);
                }
                console.log('some :', some);
                setDates(data.dates.reverse());
                setPercent(data.percent.reverse());
                setTimeWithPercent(data.timeWithPercent.reverse());
                setIsLoading(false);
            });
        }
    }
    useMemo(() => {
        if(days>30){
            setDays(30);
            return;
        }else
            getDatas();
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
                    return new Array(preTask.length).fill('task');
                });
                return preTask;
            });
        }
        setIsLoading(false);
    }


    const handleClick = (i) => {
        setSelectedTask(tasks[i]);
        setClassNameOfTask(() => {
            let classArr = new Array(tasks.length).fill('task');
            classArr[i] = 'task Active';
            return classArr;
        })
    }

    return (
        <div className="compareEfforts">
            {isLoading?<Loading/>:<></>}
            <div className="inputContainer">
                <div className="daysInput">
                    Enter the Number of Days you like to compare :
                    <input type="number" min={2} max={30} value={days} onChange={(e) => { setDays(e.target.value) }} />
                </div>
                <div className="inputTasksContainer">
                    <div className="taskInput">
                        {tasks.map((task, index) => {
                            return (<div key={index} index={index} onClick={() => handleClick(index)} className={classNameOfTask[index]}>
                                {task}
                            </div>)
                        })}
                    </div>
                </div>
            </div>
            <div className="charContainer">
                {days > 1 && selectedTask != '' && <Line
                    data={{
                        labels: dates,
                        datasets: [
                            {
                                label: "Percent ",
                                data: percent,
                                borderColor : ['white'],
                                hoverBackgroundColor: "rgba(232,105,90,0.8)",
                                hoverBorderColor: "orange",
                                scaleStepWidth: 1,
                            },
                        ]
                    }}
                    height={400}
                    width={700}
                    options={{
                        maintainAspectRatio: false,
                        
                        scales: {
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks : {
                                    color : 'white'
                                }
                            },
                            y: {
                                grid: {
                                    display: false
                                },
                                ticks : {
                                    color : 'white'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                titleAlign: 'center',
                                callbacks: {
                                    label: function (t) {
                                        return timeWithPercent[t.dataIndex];
                                    }
                                }
                            }

                        }
                    }}
                />}
            </div>
        </div>
    )
}