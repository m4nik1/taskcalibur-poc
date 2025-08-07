"use client";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

interface Task {
  id: string;
  name: string;
  startHour: number;
  durationHours: number;
  color: string;
}

export default function TaskList() {
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

  const [draggedTaskFromList, setDraggedTaskFromList] = useState<string | null>(
    null
  );

  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);

  function formatTime(hour: number) {
    const displayHour =
      Math.floor(hour) % 12 === 0 ? 12 : Math.floor(hour) % 12;

    const period = hour < 12 || hour >= 24 ? "AM" : "PM";

    const minutes =
      hour % 1 > 0
        ? `${Math.round((hour % 1) * 60)
            .toString()
            .padStart(2, "0")}`
        : "";

    return `${displayHour}${minutes}${period}`;
  }

  return (
    <div className="w-80 flex-shrink-0 pt-15 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
      </div>

      <div className="flex-1 relative bg-white">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 cursor-move 
            border-b border-gray-250 hover:bg-gray-50 dark:hover:bg-gray-800
            dark:border-gray-800"
            style={{ height: "40px" }}
            draggable
            onDragStart={(e) => {
              setDraggedTaskFromList(task.id);
              setDraggedTaskIndex(index);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", index.toString());
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const dropIndex = Number.parseInt(
                e.dataTransfer.getData("text/plain"),
                10
              );
              if (dropIndex != index) {
                const newTasks = [...tasks];
                const [movedTask] = newTasks.splice(dropIndex, 1);
                newTasks.splice(index, 0, movedTask);
                setTasks(newTasks);
              }
              setDraggedTaskIndex(null);
            }}
            onDragEnd={() => {
              setDraggedTaskFromList(null);
              setDraggedTaskIndex(null);
            }}
          >
            <input
              type="checkbox"
              className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"
            />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
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
        ))}
        <Button
          className="w-full flex gap-3 px-4 text-gray-400 
            hover-bg-gray-50 transition-colors border-b border-gray-100"
          style={{ height: "40px" }}
        >
          <div className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"></div>
          <p className="text-sm">Create Task</p>
        </Button>
      </div>
    </div>
  );
}
