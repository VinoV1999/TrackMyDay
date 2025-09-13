import FirebaseClient from "../lib/firebaseClient";
import firebaseClient from "../lib/firebaseClient";
import { DayTasks, ActiveTask, Task } from "../types/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type TaskWithoutId = Omit<Task, "id">;
export type DayTasksWithoutId = Omit<DayTasks, "id">;

type TaskContextType = {
  // client init state
  initClient: (UID: string) => void;

  // taskList init state
  tasks: Task[];
  fetchTasks: () => void;
  addTask: (task: TaskWithoutId) => void;
  removeTask: (id: string) => void;
  updateTask: (task: Task) => void;
  setFavouriteTask: (id: string) => void;

  // active task init state
  activeTask: ActiveTask | undefined;
  saveActiveTask: (activeTask: ActiveTask | undefined) => void;
  cancleAutoCutOff: () => void;
  fetchActiveTask: () => void;

  // day tasks init state
  dayTasks: DayTasks[];
  addDayTask: (task: DayTasksWithoutId) => void;
  fetchDayTasks: (day: Date) => void;

  // task details of range
  fetchTaskDetails: (start: Date, end: Date, taskIds: string[]) => Promise<{ [key: string]: { [id: string]: number } } | undefined>;
};

const InitTaskContext: TaskContextType = {
  initClient: () => {},

  tasks: [],
  fetchTasks: async () => {},
  addTask: () => {},
  removeTask: () => {},
  updateTask: () => {},
  setFavouriteTask: () => {},

  activeTask: undefined,
  saveActiveTask: () => {},
  fetchActiveTask: () => {},
  cancleAutoCutOff: () => {},

  dayTasks: [],
  addDayTask: () => {},
  fetchDayTasks: () => {},

  fetchTaskDetails: async() => {return {}},
};

const TaskContext = createContext<TaskContextType>(InitTaskContext);

export const TaskContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dayTasks, setDayTasks] = useState<DayTasks[]>([]);
  const [activeTask, setActiveTask] = useState<ActiveTask | undefined>(
    undefined
  );
  const [client, setClient] = useState<FirebaseClient | null>(null);

  const initClient = (UID: string) => {
    const instance = FirebaseClient.getInstance(UID);
    setClient(instance);
  };

  useEffect(() => {
    if (client) {
      fetchTasks();
      fetchActiveTask();
    }
  }, [client]);

  // Tasks CRUD
  const fetchTasks = async () => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }

    client
      .getTasks()
      .then((tasks) => {
        if (tasks) {
          setTasks(tasks);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  const addTask = async (task: TaskWithoutId) => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    try {
      console.log("Adding task:", task);
      const id = await client.addTask(task);
      setTasks((prevTasks) => [...prevTasks, { ...task, id }]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const removeTask = (id: string) => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    // remove task from firebase
    client.deleteTask(id);

    // update to state
    setTasks((preTasks) => preTasks.filter((t) => t.id !== id));
  };

  const updateTask = async (task: Task) => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    // add task to firebase
    await client.updateTask(task);

    // update to state
    setTasks((preTasks) => preTasks.map((t) => (t.id === task.id ? task : t)));
  };

  const setFavouriteTask = (id: string) => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    // update to state
    setTasks((preTasks) => {
      const taskToUpdate = preTasks.find((t) => t.id === id);
      if (taskToUpdate) {
        const updatedTask = {
          ...taskToUpdate,
          isFavourite: !taskToUpdate.isFavourite,
        };
        client.updateTask(updatedTask);
      }
      return preTasks.map((t) =>
        t.id === id ? { ...t, isFavourite: !t.isFavourite } : t
      );
    });
  };

  // DayTasks CRUD
  const fetchDayTasks = (day: Date) => {
    // get tasks from firebase
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    client
      .getDayTasks(day)
      .then((dayTasks) => {
        if (dayTasks) {
          setDayTasks(dayTasks);
        }
      })
      .catch((error) => {
        console.error("Error fetching day tasks:", error);
      });
  };

  const addDayTask = async (task: DayTasksWithoutId) => {
    // add task to firebase
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return "";
    }
    const id = await client.addDayTask(task);

    // update to state
    setDayTasks((preDayTasks) => [...preDayTasks, { id, ...task }]);
  };

  // ActiveTask CRUD
  const saveActiveTask = async (newActiveTask: ActiveTask | undefined) => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    if (activeTask) {
      const endAt = new Date();
      const dayTaksWithoutID: DayTasksWithoutId = {
        task: activeTask.task,
        startAt: activeTask.startAt,
        autoCutOff: activeTask.autoCutOff,
        endAt,
      };
      await addDayTask(dayTaksWithoutID);
    }
    // add active task to firebase
    client.saveActiveTask(newActiveTask);

    // update to state
    setActiveTask(newActiveTask);
  };

  const fetchActiveTask = () => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    // get active task from firebase
    client
      .getActiveTask()
      .then((activeTask) => {
        if (activeTask) {
          // check if autoCutOff expired
          const now = new Date();
          const startAt = new Date(activeTask.startAt);
          if (activeTask.autoCutOff && activeTask.task.autoEndIn) {
            const {
              hours = 0,
              minutes = 0,
              seconds = 0,
            } = activeTask.task.autoEndIn;
            const cutoffMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
            const endTime = startAt.getTime() + cutoffMs;
            if (now.getTime() > endTime) {
              // autoCutOff expired
              setActiveTask(undefined);
              client.saveActiveTask(undefined);
              // day task add
            }
          }
        }
        setActiveTask(activeTask || undefined);
      })
      .catch((error) => {
        console.error("Error fetching active task:", error);
      });
  };

  const cancleAutoCutOff = () => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    // update to firebase
    if (!activeTask) return;
    const updatedTask = { ...activeTask, autoCutOff: false };
    client.saveActiveTask(updatedTask);

    // update to state
    setActiveTask((pre) => pre && { ...pre, autoCutOff: false });
  };

  // fetch task details for range
  const fetchTaskDetails = async (start: Date, end: Date, taskIds: string[])  => {
    if (!client) {
      console.error(
        "Firebase client not initialized. Call fetchTasks with valid UID first."
      );
      return;
    }
    return await client.getDataBetween(start, end, taskIds)
  }

  return (
    <TaskContext.Provider
      value={{
        initClient,
        tasks,
        fetchTasks,
        addTask,
        updateTask,
        removeTask,
        setFavouriteTask,
        activeTask,
        saveActiveTask,
        fetchActiveTask,
        cancleAutoCutOff,
        dayTasks,
        addDayTask,
        fetchDayTasks,
        fetchTaskDetails
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const UseTask = () => useContext(TaskContext);
