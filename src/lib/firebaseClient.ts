import TimeCalculator from "../Functions/TimeCalculator";
import { db } from "../config/firebase-config";
import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  where,
  deleteField,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { ActiveTask, DayTasks, Task } from "../types/types";
import { DayTasksWithoutId, TaskWithoutId } from "../context/TaskContext";

enum CollectionNames {
  Tasks = "tasks",
  ActiveTask = "activeTask",
}

const INITCOLLECTIONNAME = "users";

class FirebaseClient {
  private static instance: FirebaseClient | null = null;
  private UID: string;

  private constructor(UID: string) {
    this.UID = UID;
  }

  public static getInstance(UID: string): FirebaseClient {
    if (!FirebaseClient.instance || FirebaseClient.instance.UID !== UID) {
      FirebaseClient.instance = new FirebaseClient(UID);
    }
    return FirebaseClient.instance;
  }

  // Tasks CRUD
  public async getTasks(): Promise<Task[]> {
    const tasksCollection = collection(
      db,
      INITCOLLECTIONNAME,
      this.UID,
      CollectionNames.Tasks
    );
    const querySnapshot = await getDocs(tasksCollection);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  }

  public async addTask(task: TaskWithoutId): Promise<string> {
    const tasksCollection = collection(
      db,
      INITCOLLECTIONNAME,
      this.UID,
      CollectionNames.Tasks
    );
    const refinedTask = Object.fromEntries(
      Object.entries(task).filter(([_, v]) => v !== undefined)
    );
    const taskRef = await addDoc(tasksCollection, refinedTask);
    return taskRef.id;
  }

  public async updateTask(task: Task): Promise<void> {
    if (!task.id) {
      throw new Error("Task ID is missing in updateTask()");
    }
    const { id, ...taskData } = task;
    const taskDoc = doc(
      db,
      INITCOLLECTIONNAME,
      this.UID,
      CollectionNames.Tasks,
      id
    );
    const refinedTask = Object.fromEntries(
      Object.entries(taskData).map(([key, value]) => [
        key,
        value !== undefined ? value : deleteField(),
      ])
    );
    return updateDoc(taskDoc, refinedTask);
  }

  public async deleteTask(taskId: string): Promise<void> {
    const taskDoc = doc(
      db,
      INITCOLLECTIONNAME,
      this.UID,
      CollectionNames.Tasks,
      taskId
    );
    return deleteDoc(taskDoc);
  }

  // Active Task CRUD
  public async getActiveTask(): Promise<ActiveTask | null> {
    const activeTaskDoc = doc(
      db,
      INITCOLLECTIONNAME,
      this.UID,
      CollectionNames.ActiveTask,
      "info"
    );
    const docSnap = await getDoc(activeTaskDoc);
    if (docSnap.exists()) {
      const activeTaskData = docSnap.data();
      const startAt = new Timestamp(
        activeTaskData.startAt.seconds,
        activeTaskData.startAt.nanoseconds
      );

      return { ...activeTaskData, startAt: startAt.toDate() } as ActiveTask;
    } else {
      return null;
    }
  }

  public async saveActiveTask(
    activeTask: ActiveTask | undefined
  ): Promise<void> {
    if (!activeTask) {
      const activeTaskDoc = doc(
        db,
        INITCOLLECTIONNAME,
        this.UID,
        CollectionNames.ActiveTask,
        "info"
      );
      return deleteDoc(activeTaskDoc);
    }
    const activeTaskDoc = doc(
      db,
      INITCOLLECTIONNAME,
      this.UID,
      CollectionNames.ActiveTask,
      "info"
    );
    const refinedTask = Object.fromEntries(
      Object.entries(activeTask).filter(([_, v]) => v !== undefined)
    );
    return setDoc(activeTaskDoc, refinedTask);
  }

  // Day Tasks CRUD
  public async addDayTask(dayTask: DayTasksWithoutId): Promise<string> {
    const dayTasksCollection = collection(
      db,
      INITCOLLECTIONNAME,
      this.UID,
      dayTask.startAt.toISOString().slice(0, 10)
    );
    const refinedTask = Object.fromEntries(
      Object.entries(dayTask.task).filter(([_, v]) => v !== undefined)
    );
    const taskRef = await addDoc(dayTasksCollection, {
      ...dayTask,
      task: refinedTask,
    });
    return taskRef.id;
  }

  public async getDayTasks(day: Date): Promise<DayTasks[]> {
    const dayTasksCollection = collection(
      db,
      INITCOLLECTIONNAME,
      this.UID,
      day.toISOString().slice(0, 10)
    );
    const q = query(dayTasksCollection, orderBy("startAt", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const dayTaskData = doc.data();
      dayTaskData.startAt = new Timestamp(
        dayTaskData.startAt.seconds,
        dayTaskData.startAt.nanoseconds
      ).toDate();
      if (dayTaskData.endAt) {
        dayTaskData.endAt = new Timestamp(
          dayTaskData.endAt.seconds,
          dayTaskData.endAt.nanoseconds
        ).toDate();
      }
      return { id: doc.id, ...dayTaskData } as DayTasks;
    });
  }
}

export default FirebaseClient;
