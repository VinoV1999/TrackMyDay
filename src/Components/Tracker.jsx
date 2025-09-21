import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import TrackerServices from "../context/trackerServices";
import TimeCalculator from "../Functions/TimeCalculator";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faMarker, faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Components/Loading';

export default function Tracker() {
    const { user } = UserAuth();
    const [tasks, setTasks] = useState(() => []);
    const [editedTasks, setEditedTasks] = useState(() => []);
    const [task, setTask] = useState(() => '');
    const [classNameOfTask, setClassNameOfTask] = useState(() => {
        return new Array(tasks.length).fill('task');
    });
    const [isInEditMode, setIsInEditMode] = useState(() => false);
    const [activeTask, setActiveTask] = useState(() => undefined);
    const [activeTaskFor, setActiveTaskFor] = useState(() => '00 : 00 : 00');
    const [obtainMillies, setObtainMillies] = useState(() => '');
    const [taskPercent, setTaskPercent] = useState(() => '');
    const [isLoading, setIsLoading] = useState(() => true);

    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            const updateTime = TimeCalculator.inBetween(parseInt(obtainMillies));
            if (!updateTime.includes("NaN")) {
                setActiveTaskFor(updateTime);
            }
        }, 1000);
    }, [activeTaskFor])
    const getData = async () => {
        let active;
        const tasks = await TrackerServices.getTasks(user.uid);
        const activeTaskcoll = await TrackerServices.getActiveTask(user.uid);
        if (tasks.data() === undefined || tasks.data().Tasks.length === 0) {
            setIsInEditMode(true);
            setIsLoading(false);
        } else {
            if (activeTaskcoll.data() !== undefined)
                active = activeTaskcoll.data().task;
        }
        if (tasks.data() !== undefined) {
            setTasks((preTask) => {
                const TASKSINDB = tasks.data().Tasks;
                preTask = TASKSINDB;
                setClassNameOfTask(() => {
                    const classArr = new Array(preTask.length).fill('task');
                    if (active !== undefined && TASKSINDB.includes(active))
                        classArr[TASKSINDB.indexOf(active)] = 'task Active';
                    return classArr;
                });
                return preTask;
            });
        } else {
            await TrackerServices.addUser(user.uid);
        }
        if (!(active === 'Not in Track') && active !== undefined) {
            const taskEffortColl = await TrackerServices.getTaskEffortPerDay(user.uid, activeTaskcoll.data().task, activeTaskcoll.data().Date);
            setTaskPercent(taskEffortColl.data());
        }
        setActiveTask(activeTaskcoll.data());
        if (activeTaskcoll.data() !== undefined) {
            if (TimeCalculator.isToday(activeTaskcoll.data().Date)) {
                setObtainMillies(activeTaskcoll.data().startAt.toMillis());
                setActiveTaskFor(TimeCalculator.inBetween(activeTaskcoll.data().startAt.toMillis()));
            }
            else {
                setObtainMillies(new Date(TimeCalculator.formated().format(new Date()).split('/').join('-')).getTime());
                setActiveTaskFor(TimeCalculator.inBetween(new Date(TimeCalculator.formated().format(new Date()).split('/').join('-')).getTime()));
            }
        }
        setIsLoading(false);
    }

    const addNewTask = () => {
        if (!tasks.includes(task)) {
            setEditedTasks((preTask) => {
                preTask = [...preTask, task];
                setClassNameOfTask((preClass) => {
                    preClass = [...preClass, 'task']
                    return preClass;
                });
                return preTask;
            });
        }
        setTask('');
    }
    const handleEvents = (event) => {
        if (event.key === 'Enter')
            addNewTask();
    }
    const scheduledTask = async (i) => {
        const startAt = TrackerServices.getServerTimeStamp();
        let isFirst = false;
        const resetTimer = async () => {
            const active = await TrackerServices.getActiveTask(user.uid)
            setActiveTask(active.data());
            setObtainMillies(active.data().startAt.toMillis());
            if(isFirst){
                setTimeout(() => {
                    setActiveTaskFor(TimeCalculator.inBetween(active.data().startAt.toMillis()));
                }, 1100);
            }
            if (!(active.data().task === 'Not in Track')) {
                const taskEffortColl = await TrackerServices.getTaskEffortPerDay(user.uid, active.data().task, active.data().Date);
                setTaskPercent(taskEffortColl.data());
            }
        }
        if (activeTask !== undefined) {
            let taskToAdd = {};
            let percent = {};
            taskToAdd.task = activeTask.task;
            taskToAdd.startAt = activeTask.startAt;
            taskToAdd.endAt = startAt;
            taskToAdd.time = activeTaskFor;
            const secs = TimeCalculator.timeToSeconds(activeTaskFor);
            taskToAdd.seconds = secs;
            taskToAdd.percent = TimeCalculator.percentOfDay(secs);
            percent.date = startAt;
            percent.percent = parseFloat(taskToAdd.percent);
            percent.dateNow = Date.now();
            if (tasks[i] === activeTask.task) {
                const value = { startAt, 'task': "Not in Track", 'Date': TimeCalculator.formated().format(new Date()).split('/').join('-') };
                await TrackerServices.setActiveTask(user.uid, value);
                if (!TimeCalculator.isToday(activeTask.Date)) {
                    await TrackerServices.setTasksOfTheDay(user.uid, TimeCalculator.formated().format(new Date()).split('/').join('-'), taskToAdd);
                    await TrackerServices.setTaskEffortPerDay(user.uid, activeTask.task, TimeCalculator.formated().format(new Date()).split('/').join('-'), percent);
                    const time = TimeCalculator.inBetween(activeTask.startAt.toMillis(), TimeCalculator.getTomorrow(new Date(activeTask.Date)));
                    taskToAdd.time = time;
                    taskToAdd.seconds = TimeCalculator.timeToSeconds(time);
                    taskToAdd.percent = TimeCalculator.percentOfDay(TimeCalculator.timeToSeconds(time));
                    percent = taskPercent === undefined ? { date: startAt, percent: 0 } : taskPercent;
                    percent.percent += parseFloat(taskToAdd.percent);
                    percent.dateNow = activeTask.Date.split('-').map((val, index)=>index === 1 && val.length === 1 ? '0' + val: val).join('-');
                    await TrackerServices.setTaskEffortPerDay(user.uid, activeTask.task, activeTask.Date, percent);
                    await TrackerServices.setTasksOfTheDay(user.uid, activeTask.Date, taskToAdd)
                } else {
                    percent.percent += taskPercent === undefined ? 0 : taskPercent.percent;
                    percent.dateNow = activeTask.Date.split('-').map((val, index)=>index === 1 && val.length === 1 ? '0' + val: val).join('-');
                    await TrackerServices.setTaskEffortPerDay(user.uid, activeTask.task, activeTask.Date, percent);
                    await TrackerServices.setTasksOfTheDay(user.uid, TimeCalculator.formated().format(new Date()).split('/').join('-'), taskToAdd)
                }
                resetTimer();
                setClassNameOfTask(new Array(tasks.length).fill('task'));
                setIsLoading(false);
                return;
            }
            const value = { startAt, 'task': tasks[i], 'Date': TimeCalculator.formated().format(new Date()).split('/').join('-') };
            await TrackerServices.setActiveTask(user.uid, value);
            if (activeTask.task !== "Not in Track") {
                if (!TimeCalculator.isToday(activeTask.Date)) {
                    await TrackerServices.setTasksOfTheDay(user.uid, TimeCalculator.formated().format(new Date()).split('/').join('-'), taskToAdd);
                    await TrackerServices.setTaskEffortPerDay(user.uid, activeTask.task, TimeCalculator.formated().format(new Date()).split('/').join('-'), percent);
                    const time = TimeCalculator.inBetween(activeTask.startAt.toMillis(), TimeCalculator.getTomorrow(new Date(activeTask.Date)));
                    taskToAdd.time = time;
                    taskToAdd.seconds = TimeCalculator.timeToSeconds(time);
                    taskToAdd.percent = TimeCalculator.percentOfDay(TimeCalculator.timeToSeconds(time));
                    percent = taskPercent === undefined ? { date: activeTask.startAt, percent: 0 } : taskPercent;
                    percent.percent += parseFloat(taskToAdd.percent);
                    await TrackerServices.setTasksOfTheDay(user.uid, activeTask.Date, taskToAdd);
                    await TrackerServices.setTaskEffortPerDay(user.uid, activeTask.task, activeTask.Date, percent);
                } else {
                    percent.percent += taskPercent === undefined ? 0 : taskPercent.percent;
                    await TrackerServices.setTaskEffortPerDay(user.uid, activeTask.task, TimeCalculator.formated().format(new Date()).split('/').join('-'), percent);
                    await TrackerServices.setTasksOfTheDay(user.uid, TimeCalculator.formated().format(new Date()).split('/').join('-'), taskToAdd)
                }
            }
        }else{
            isFirst=true;
            const value = { startAt, 'task': tasks[i], 'Date': TimeCalculator.formated().format(new Date()).split('/').join('-') };
            await TrackerServices.setActiveTask(user.uid, value);
            resetTimer();
        }
        setClassNameOfTask(() => {
            let cName = new Array(tasks.length).fill('task')
            cName[i] = "task Active";
            resetTimer();
            return cName;
        });
        setIsLoading(false);
    }
    const editLabels = (bool) => {
        setIsInEditMode(bool);
        setEditedTasks(tasks);
        if (!bool) addNewTasksInDB();
    }
    const addNewTasksInDB = async () => {
        setTasks(editedTasks);
        await TrackerServices.updateTasks(user.uid, { Tasks: editedTasks });
    }
    const deleteTasks = (ind) => {
        setEditedTasks((preTask) => {
            preTask = preTask.filter((val) => { return val !== preTask[ind] });;
            return preTask
        })
    }
    return (
        <div className="tracker">
            {isLoading ? <Loading /> : <></>}
            <div className="timercontainer">
                <div className="timer">
                    {tasks.length === 0 ?
                        <div className="timerTitle">{user.displayName + ', Add Tasks And Begin Tracking '}
                        </div> :
                        <div className="timerTitle">{user.displayName + ', Your Current Task is '}
                            <span className="activeTask">{activeTask===undefined?'':activeTask.task}</span>
                        </div>
                    }
                    <div className="timerDisplay">
                        <div className="subTimerDisplay">
                            <h2>{activeTaskFor}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="timerLable">
                    <div className="timerControllers">
                        {isInEditMode ?
                            <div className="controlBox">
                                <input className="labelTB" value={task} onKeyPress={(e) => { handleEvents(e) }} onChange={(e) => { setTask(e.target.value) }} />
                                <FontAwesomeIcon className="icon save" icon={faSave} onClick={() => { editLabels(false) }} />
                                <FontAwesomeIcon className="icon cancle" icon={faXmark} onClick={() => setIsInEditMode(false)} />
                            </div> :
                            <FontAwesomeIcon className="icon edit" icon={faMarker} onClick={() => { editLabels(true) }} />

                        }
                    </div>
                    <div className="tasksContainer">
                        {isInEditMode ? editedTasks.map((task, index) => {
                            return (
                                <div key={index} index={index} className={classNameOfTask[index]}>
                                    {task}
                                    <FontAwesomeIcon className="icon delete" icon={faTrash} onClick={() => { deleteTasks(index) }} />
                                </div>
                            )
                        }) : tasks.map((task, index) => {
                            return (<div key={index} index={index} onClick={() => { setIsLoading(true); scheduledTask(index) }} className={classNameOfTask[index]}>
                                {task}
                            </div>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}