"use client";

import { useRef, useState } from "react";
import GantGrid from "@/components/gantt-grid";
import TaskList from "@/components/TaskList";
import { Task } from "../../../types";
import { useGanttDrag } from "../../../hooks/use-gantt-drag";

export default function HomePage() {
  // Constants for Gantt chart scaling
  const HOUR_WIDTH_PX = 70; // Increased width to accommodate time labels better
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
  const END_HOUR_DISPLAY = 25; // End time for the visible grid (1 AM next day, 24 + 1 = 25)

  const gridRef = useRef<HTMLDivElement>(null!);
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
      color: "bg-blue-500",
    },
    {
      id: "3",
      name: "Client Call",
      startHour: 16.5,
      durationHours: 1,
      color: "bg-blue-500",
    },
    {
      id: "4",
      name: "Code Review",
      startHour: 11,
      durationHours: 2,
      color: "bg-blue-500",
    },
  ]);

  const { isDragging, dragStartInfo, tempTask, handleMouseDown } = useGanttDrag(
    {
      tasks,
      setTasks,
      gridRef,
      HOUR_WIDTH_PX,
      START_HOUR_DISPLAY,
      END_HOUR_DISPLAY,
    }
  );

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

        <GantGrid 
          setTasks={setTasks} 
          tasks={tasks} 
          gridRef={gridRef} 
          handleMouseDown={handleMouseDown} 
          dragStartInfo={dragStartInfo}
          draggedTask={draggedTask}
        />
      </div>
    </div>
  );
}
