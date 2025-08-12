import { useState } from "react";
import { Task } from "../../types";
import { formatTime } from "@/lib/utils"

interface TaskItemProps {
  setDraggedTask: (id: string | null) => void;
  setDraggedTaskIndex: (index: number | null) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  task: Task;
  tasks: Task[];
  index: number;
}

export default function TaskItem({ setDraggedTask, setDraggedTaskIndex, task, tasks, index, setTasks }: TaskItemProps) {
  const [completeCheck, setCheck] = useState(false);

  function onTaskDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropIndex = Number.parseInt(
      e.dataTransfer.getData("text/plain"),
      10,
    );
    if (dropIndex != index) {
      const newTasks = [...tasks];
      const [movedTask] = newTasks.splice(dropIndex, 1);
      newTasks.splice(index, 0, movedTask);
      setTasks(newTasks);
    }
    setDraggedTaskIndex(null);
  }

  return (
    <div
      className="flex items-center gap-3 px-4 cursor-move
            border-b border-gray-250 hover:bg-gray-50 dark:hover:bg-gray-800
            dark:border-gray-800"
      style={{ height: "40px" }}
      draggable
      onDragStart={(e) => {
        setDraggedTask(task.id);
        setDraggedTaskIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => onTaskDrop(e)}
      onDragEnd={() => {
        setDraggedTask(null);
        setDraggedTaskIndex(null);
      }}
    >
      <input
        type="checkbox"
        onChange={(e) => setCheck(e.target.value)}
        className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        <p className={`text-sm font-medium text-gray-900 truncate ${completeCheck ? 'line-through' : ''}`}>
          {task.name}
        </p>
        <div className="flex items-center text-xs text-gray-500 mt-0.5">
          <span>{formatTime(task.startHour)}</span>
          <span className="mx-1">-</span>
          <span>{formatTime(task.startHour + task.durationHours)}</span>
        </div>
      </div>
      <hr className="my-12 h-0.5 border-t-0 bg-amber-400" />
    </div>
  )
}