import React, { useState } from "react";
import { UseTask } from "../../context/TaskContext";
import { Task } from "../../types/types";

type FormDataType = {
  name: string;
  category: string;
  hours: number | "";
  minutes: number | "";
  seconds: number | "";
  isFavourite: boolean;
};

type AddTaskFormProps = {
  closeModal: (open: boolean) => void;
  existingTask?: Task;
};

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  closeModal,
  existingTask,
}) => {
  const { addTask, updateTask, tasks } = UseTask(); // ✅ get tasks to read categories

  const initFormData: FormDataType = {
    name: existingTask ? existingTask.name : "",
    category: existingTask ? existingTask.category : "",
    hours: existingTask ? existingTask.autoEndIn?.hours || "" : "",
    minutes: existingTask ? existingTask.autoEndIn?.minutes || "" : "",
    seconds: existingTask ? existingTask.autoEndIn?.seconds || "" : "",
    isFavourite: existingTask ? existingTask.isFavourite : false,
  };

  const [formData, setFormData] = useState<FormDataType>(initFormData);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { name, category, hours, minutes, seconds, isFavourite } = formData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) return;

    const formattedTask = {
      name,
      category,
      isFavourite,
      autoEndIn:
        hours || minutes || seconds
          ? {
              hours: Number(hours) || 0,
              minutes: Number(minutes) || 0,
              seconds: Number(seconds) || 0,
            }
          : undefined,
    };

    if (existingTask) {
      updateTask({ ...existingTask, ...formattedTask });
    } else {
      addTask(formattedTask);
    }

    closeModal(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "category") {
      setShowSuggestions(value.length > 0);
    }
  };

  // ✅ Extract unique categories from tasks
  const categories = Array.from(new Set(tasks.map((t) => t.category)));

  // ✅ Filter suggestions by substring match
  const filteredSuggestions = category
    ? categories.filter((c) => c.toLowerCase().includes(category.toLowerCase()))
    : [];

  return (
    <div className="relative">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => closeModal(false)}
        className="absolute top-3 right-4 text-gray-400 hover:text-white"
      >
        ✕
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-brand-800 m-2 p-4 md:p-6 rounded-2xl shadow-lg flex flex-col gap-5 max-w-md"
      >
        <h2 className="text-xl font-semibold text-white text-start">
          {existingTask ? "Edit Task" : "Add New Task"}
        </h2>

        {/* Task name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm text-gray-300 text-start">
            Task Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={handleFormChange}
            placeholder="Enter task name"
            className="w-full p-2.5 rounded-lg bg-brand-900 text-white border border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category with suggestions */}
        <div className="flex flex-col gap-1 relative">
          <label
            htmlFor="category"
            className="text-sm text-gray-300 text-start"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            name="category"
            value={category}
            onChange={handleFormChange}
            placeholder="Work, Personal, etc."
            className="w-full p-2.5 rounded-lg bg-brand-900 text-white border border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            autoComplete="off"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute top-full mt-1 w-full bg-brand-900 border border-brand-700 rounded-lg shadow-lg z-10">
              {filteredSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, category: s }));
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-brand-700 text-white"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Auto End Inputs */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300 text-start">
            Auto End In
          </label>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              name="hours"
              value={hours}
              onChange={handleFormChange}
              placeholder="Hrs"
              className="p-2 rounded-lg bg-brand-900 text-white border border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              min={0}
            />
            <input
              type="number"
              name="minutes"
              value={minutes}
              onChange={handleFormChange}
              placeholder="Min"
              className="p-2 rounded-lg bg-brand-900 text-white border border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              min={0}
              max={59}
            />
            <input
              type="number"
              name="seconds"
              value={seconds}
              onChange={handleFormChange}
              placeholder="Sec"
              className="p-2 rounded-lg bg-brand-900 text-white border border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              min={0}
              max={59}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 rounded-lg transition shadow-md"
        >
          {existingTask ? "Update Task" : "+ Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;
