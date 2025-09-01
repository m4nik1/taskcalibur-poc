import { TaskDB } from "../../types";

interface CreateTaskProps {
  setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  tasks: TaskDB[];
  currentDate: Date;
}

export default function CreateTaskButton({
  setTasks,
  tasks,
  currentDate,
}: CreateTaskProps) {
  async function createNewTask() {
    const newTask: TaskDB = {
      name: "",
      startTime: currentDate, // Default start time
      status: "Draft",
      Duration: 60, // Default duration
      EndTime: currentDate,
    };
    console.log("Making a new task");
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  return (
    <button
      onClick={createNewTask}
      className="w-full cursor-pointer flex items-center gap-3 px-4 text-gray-400
                hover-bg-gray-50 transition-colors border-b border-gray-100"
      style={{ height: "40px" }}
    >
      <div className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"></div>
      <p className="text-sm">Create Task</p>
    </button>
  );
}
