import TasksCalendar from "../Components/calender/DayTaskCalender";
import Timer from "../Components/calender/Timer";
import TaskList from "../Components/task/TaskList";

export default function homePage() {
  return (
    <div className="flex flex-col gap-4 h-full w-full md:flex-row md:w-[99%]">
      {/* left Half - Timer & Tasks */}
      <div className="w-full md:w-1/2 grid grid-rows-2 gap-4 h-[900px] md:h-[calc(100vh-40px)]">
        {/* Timer (Top Half) */}
        <Timer />

        {/* Tasks (Bottom Half) */}
        <TaskList />
      </div>

      {/* right Half - Calendar */}
      <div className="w-full md:w-1/2 mb-4">
        <TasksCalendar date={new Date()}/>
      </div>
    </div>
  );
}
