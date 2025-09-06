import { useState } from "react";
import { UseTask } from "../../context/TaskContext";
import AddTaskForm from "./AddTask";
import {
  EditIcon,
  FavouriteIcon,
  RemoveIcon,
  TaskIcon,
} from "../../utils/Icons";
import { Task } from "../../types/types";

const TaskList: React.FC = () => {
  const { tasks, activeTask, saveActiveTask, setFavouriteTask, removeTask } = UseTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);

  // Empty state
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border border-brand-100 bg-light shadow-sm text-center">
        <p className="text-gray-400 text-sm">
          No tasks yet. Create a new one and start tracking your time.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-all shadow-sm"
        >
          + Add Task
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <AddTaskForm
              closeModal={() => setIsModalOpen(false)}
              existingTask={undefined}
            />
          </div>
        )}
      </div>
    );
  }

  // Task list
  return (
    <div className="p-6 rounded-2xl border border-brand-100 bg-light shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-brand-700 flex gap-1 items-center justify-center">
          <TaskIcon className="w-5 h-5" color="#6d28d9" /> Your Tasks
        </h2>
        <button
          onClick={() => {
            setEditTask(undefined);
            setIsModalOpen(true);
          }}
          className="px-4 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition"
        >
          + Add
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tasks.sort((a, _) => a.isFavourite ? -1 : 1).map((task) => (
          <div
            key={task.id}
            onClick={() =>{
              const activeTaskData = task.id === activeTask?.task.id ? undefined : {
                task,
                startAt: new Date(),
                autoCutOff: !!task.autoEndIn,
              }
              saveActiveTask(activeTaskData)
            }}
            className={`relative p-3 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium 
                      cursor-pointer hover:bg-brand-100 transition-all shadow-sm group ${task.id === activeTask?.task.id ? "ring-2 ring-brand-400" : ""}`}
          >
            {/* Task Name */}
            <span>{task.name}</span>

            {/* Hover Actions */}
            <div
              className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 
             transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()} // stop triggering saveActiveTask
            >
              {/* Favourite */}
              <button
                onClick={() => {
                  setFavouriteTask(task.id);
                }}
                className={`p-1 rounded-full hover:bg-brand-200 
                ${
                  task.isFavourite
                    ? "text-brand-700 hover:text-gray-600"
                    : "text-gray-600 hover:text-brand-700"
                }`}
              >
                <FavouriteIcon className="w-5 h-5" />
              </button>

              {/* Edit */}
              <button
                onClick={() => {
                  setEditTask(task);
                  setIsModalOpen(true);
                }}
                className="p-1 rounded-full hover:bg-brand-200 text-gray-600 hover:text-brand-700"
              >
                <EditIcon className="w-5 h-5" />
              </button>

              {/* Remove */}
              <button
                onClick={() => {
                  removeTask(task.id);
                }}
                className="p-1 rounded-full hover:bg-brand-200 text-gray-600 hover:text-red-600"
              >
                <RemoveIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <AddTaskForm
            closeModal={() => {
              setIsModalOpen(false);
              if (editTask) setEditTask(undefined);
            }}
            existingTask={editTask}
          />
        </div>
      )}
    </div>
  );
};

export default TaskList;
