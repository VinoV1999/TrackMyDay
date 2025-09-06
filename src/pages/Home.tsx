import TasksCalendar from "../Components/calender/DayTaskCalender";
import Timer from "../Components/calender/Timer";
import TaskList from "../Components/task/TaskList";

export default function homePage() {
  return (
    <div className="flex gap-4 h-screen w-[99%]">
      {/* Left Half - Calendar */}
      <div className="w-1/2">
        <TasksCalendar date={new Date()}/>
      </div>

      {/* Right Half - Timer & Tasks */}
      <div className="w-1/2 grid grid-rows-2 gap-4 h-[calc(100vh-40px)]">
        {/* Timer (Top Half) */}
        <Timer />

        {/* Tasks (Bottom Half) */}
        <TaskList />
      </div>
    </div>
  );
}
