import { TaskDB } from "../../types";

interface CreateTaskProps {
    setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
    tasks: TaskDB[];
}

export default function CreateTaskButton({ setTasks, tasks }: CreateTaskProps) {
    function createNewTask() {
        const newTask= {
            id: Date.now().toString
            name: ``,
            startHour: 9, // Default start time
            durationHours: 1, // Default duration
            color: "bg-blue-500",
        }
        setTasks((prevTasks) => [...prevTasks, newTask])
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
    )
} 