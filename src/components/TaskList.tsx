"use client";

import { Task } from "../../types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setDraggedTask: (id: string | null) => void;
  setDraggedTaskIndex: (index: number | null) => void;
  dragStartInfo: { taskId: string | null }| null
}

export default function TaskList({
  tasks,
  setTasks,
  setDraggedTask,
  setDraggedTaskIndex,
}: TaskListProps) {


  function createNewTask() {
    const newTask: Task = {
      id: Date.now().toString(),
      name: `Task ${tasks.length + 1}`,
      startHour: 9, // Default start time
      durationHours: 1, // Default duration
      color: "bg-blue-500",
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  return (
    <div className="w-80 flex-shrink-0 pt-15 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
      </div>

      <div className="flex-1 relative bg-white">
        {tasks.map((task, index) => (
          <TaskItem 
            key={index} 
            task={task}
            tasks={tasks}
            index={index}
            setTasks={setTasks}
            setDraggedTask={setDraggedTask} 
            setDraggedTaskIndex={setDraggedTaskIndex} 
          />
        ))}
        <button
          onClick={createNewTask}
          className="w-full flex gap-3 px-4 text-gray-400
            hover-bg-gray-50 transition-colors border-b border-gray-100"
          style={{ height: "40px" }}
        >
          <div className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"></div>
          <p className="text-sm">Create Task</p>
        </button>
      </div>
    </div>
  );
}
