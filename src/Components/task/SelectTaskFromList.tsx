import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UseTask } from "../../context/TaskContext";
import { Task } from "../../types/types";

type SelectTaskFromListProps = {
  selectedTasks: Task[];
  setSelectedTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  maxTasks: number;
};
const SelectTaskFromList: React.FC<SelectTaskFromListProps> = ({
  selectedTasks,
  setSelectedTasks,
  maxTasks,
}) => {
  const { tasks } = UseTask();
  const [taskName, setTaskName] = useState<string>("");

  const filteredSuggestions = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(taskName.toLowerCase()) &&
      !selectedTasks.some((t) => t.name === task.name)
  );

  return (
    <div className="flex items-center gap-4">
      {/* Animated Input */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="relative w-[300px]"
        >
          <input
            disabled={selectedTasks.length >= maxTasks}
            autoFocus
            id="taskName"
            type="text"
            name="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Search your tasks"
            className="disabled:cursor-not-allowed disabled:opacity-50 w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            autoComplete="off"
          />

          {taskName && filteredSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
              {filteredSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSelectedTasks((prev) => [...prev, s]);
                    setTaskName("");
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-gray-900"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SelectTaskFromList;
