import React, { useState, useEffect } from "react";
//import Loading from "./Loading";
import TrackerServices from "../context/trackerServices";
import { UserAuth } from "../context/authContext";
import { onSnapshot } from 'firebase/firestore';
import TimeCalculator from '../Functions/TimeCalculator'
import { Pie } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import Loading from '../Components/Loading';

export default function ViewEfforts() {
    const { user } = UserAuth();
    const [date, setDate] = useState(() => "")
    const [times, setTimes] = useState(() => []);
    const [labels, setLabels] = useState(() => []);
    const [labelsWithTime, setLabelsWithTime] = useState(() => '');
    const [isLoading, setIsLoading] = useState(()=>false);

    useEffect(() => {
        getSelectedDayEffort();
    }, [date])
    
    const getSelectedDayEffort = async () => {
        if (date !== '') {
            setIsLoading(true);
            const q = await TrackerServices.getDaysQuery(user.uid, date);
            const activeTaskcoll = await TrackerServices.getActiveTask(user.uid);
            if(activeTaskcoll.data()===undefined){
                setIsLoading(false);
                return;
            }
            const data = { tasks: [], timeings: [], tasksWithTime: [] };
            let lastTaskStAt = '';
            let totalMillies = 0;
            let sumofPercent = 0;
            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.timeings.push(parseFloat(doc.data().percent));
                    data.tasks.push(doc.data().task);
                    data.tasksWithTime.push(doc.data().time + ' - (' + parseFloat(doc.data().percent) + '%)')
                    totalMillies += doc.data().seconds * 1000;
                    lastTaskStAt = (doc.data().endAt.toMillis() == undefined || doc.data().endAt.toMillis() == null) ? 0 : doc.data().endAt.toMillis();
                    sumofPercent += parseFloat(doc.data().percent);
                });
                const formatedDate = date.split('-').join('/');
                if (TimeCalculator.isToday(date)) {
                    if (activeTaskcoll.data().task !== 'Not in Track') {
                        const task = 'Still - ' + activeTaskcoll.data().task;
                        lastTaskStAt = activeTaskcoll.data().startAt.toMillis();
                        const time = TimeCalculator.inBetween(parseInt(lastTaskStAt));
                        const percent = TimeCalculator.percentOfDay(TimeCalculator.timeToSeconds(time));
                        data.tasks.push(task);
                        data.timeings.push(parseFloat(percent));
                        data.tasksWithTime.push(time + ' - (' + percent + '%)');
                    }
                } else {
                    if (new Date(date.split('-').join('/')).getTime() < Date.now()) {
                        const obtainedPercent = parseFloat(100 - sumofPercent).toFixed(2);
                        if (obtainedPercent > 0.06) {
                            const between = TimeCalculator.percentToHrs(obtainedPercent);
                            if (obtainedPercent > 0) {
                                data.tasks = ['Not in Track', ...data.tasks];
                                data.timeings = [obtainedPercent, ...data.timeings];
                                data.tasksWithTime = [between + ' - (' + obtainedPercent + '%)', ...data.tasksWithTime];
                            }
                        }
                    }
                }
                setTimes(data.timeings);
                setLabels(data.tasks);
                setLabelsWithTime(data.tasksWithTime);
                setIsLoading(false);
            });
        }
    }

    const setColDate = (date) => {
        if (date !== '') {
            setDate(new Date(date).toLocaleDateString().split('/').join('-'));
        }
    }
    return (
        <div className="viewEfforts">
            {isLoading?<Loading/>:<></>}
            <input type="date" onChange={(e) => { setColDate(e.target.value) }} />
            <div className="chart">
                {labels.length > 0 && times.length > 0 && <Pie
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                label: "Percent ",
                                data: times,
                                backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0', '#ff9f40', '#9966ff', '#ffcd56', '#c9cbcf'],
                                hoverBackgroundColor: "rgba(232,105,90,0.8)",
                                hoverBorderColor: "orange",
                                scaleStepWidth: 1,
                            }
                        ]
                    }}
                    height={800}
                    width={800}
                    options={{
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color : 'white',
                                }
                            },
                            tooltip: {
                                titleAlign: 'center',
                                callbacks: {
                                    label: function (t) {
                                        return labelsWithTime[t.dataIndex];
                                    }
                                }
                            }
                        }
                    }
                    }
                />}
                {date !== '' && labels.length === 0 && times.length === 0 && <Pie
                    data={{
                        labels: [new Date(date.split('-').join('/')).getTime() > Date.now() ? 'Yet to Track' : 'Not in Track'],
                        datasets: [
                            {
                                label: "Percent ",
                                data: [100]
                            }
                        ]
                    }}
                    height={600}
                    width={600}
                    options={{
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                titleAlign: 'center',
                            },
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color : 'white',
                                }
                            }
                        }
                    }}
                />}
            </div>
        </div>
    )
}