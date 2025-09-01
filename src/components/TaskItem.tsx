import { useRef, useState } from "react";
import { TaskDB } from "../../types";
import { formatTime } from "@/lib/utils";

interface TaskItemProps {
  setDraggedTask: (id: number | null) => void;
  setDraggedTaskIndex: (index: number | null) => void;
  setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  task: TaskDB;
  tasks: TaskDB[];
  index: number;
}

export default function TaskItem({
  setDraggedTask,
  setDraggedTaskIndex,
  task,
  tasks,
  index,
  setTasks,
}: TaskItemProps) {
  const [completeCheck, setCheck] = useState(false);
  const taskName = useRef(task.name);

  function taskComplete(complete: boolean) {
    const newTasks = [...tasks];
    newTasks.splice(index, 1, task);
    setTasks(newTasks);
    setCheck(complete);
  }

  // Add update change to DB to fix the name of the task
  function confirmTask(e: React.KeyboardEvent<HTMLInputElement> | undefined) {
    if (e?.code == "Enter") {
      try {
        const newTasks = [...tasks];
        task.name = taskName.current.valueOf.toString();
        newTasks.splice(index, 1, task);
        task.id = 20000;

        fetch("/api/addTask", {
          method: "POST",
          body: JSON.stringify(task),
        });

        setTasks(newTasks);
      } catch (err) {
        console.log("We have an error");
        console.error(err);
      }
    } else if (e.code == "Backspace" && taskName.current.value == "") {
      console.log("Deleting task");
      const newTasks = [...tasks];
      // setTasks(newTasks.splice(index, 1, task))
      newTasks.splice(index, 1);

      fetch("/api/deleteTask", {
        method: "POST",
        body: JSON.stringify(task),
      });

      setTasks(newTasks);
    }
  }

  function onTaskDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropIndex = Number.parseInt(e.dataTransfer.getData("text/plain"), 10);
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
            border-b border-gray-250 hover:bg-gray-50"
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
        onChange={(e) => taskComplete(e.target.checked)}
        className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"
        placeholder="New Task"
      />
      <div className="flex-grow min-w-0">
        <input
          className={`text-sm font-medium text-gray-900 truncate ${
            completeCheck ? "line-through" : ""
          }`}
          onKeyDown={confirmTask}
          placeholder="New Task"
          defaultValue={task.name}
          ref={taskName}
        />
        <div className="flex items-center text-xs text-gray-500 mt-0.5">
          <span>{formatTime(task.startTime.getHours())}</span>
          <span className="mx-1">-</span>
          <span>
            {formatTime(task.startTime.getHours() + task.Duration / 60)}
          </span>
        </div>
      </div>
      <hr className="my-12 h-0.5 border-t-0 bg-amber-400" />
    </div>
  );
}
