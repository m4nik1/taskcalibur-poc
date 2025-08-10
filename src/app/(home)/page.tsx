"use client";

import { useRef, useState } from "react";
import GantGrid from "@/components/gantt-grid";
import TaskList from "@/components/TaskList";
import { Task } from "../../../types";

export default function HomePage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Team Standup",
      startHour: 9,
      durationHours: 0.5,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Project Review",
      startHour: 14,
      durationHours: 1,
      color: "bg-green-500",
    },
    {
      id: "3",
      name: "Client Call",
      startHour: 16.5,
      durationHours: 1,
      color: "bg-yellow-500",
    },
    {
      id: "4",
      name: "Code Review",
      startHour: 11,
      durationHours: 2,
      color: "bg-purple-500",
    },
  ]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex bg-gray-50">
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          setDraggedTask={setDraggedTask}
          setDraggedTaskIndex={setDraggedTaskIndex}
          dragStartInfo={dragStartInfo}
        />

        <GantGrid setTasks={setTasks} tasks={tasks} gridRef={gridRef} />
      </div>
    </div>
  );
}
