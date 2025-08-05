"use client";

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
    <div className="w-80 flex-shrink-0 bg-white border-r border-gray-900">
      <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
      </div>

      <div className="relative bg-white">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="absolute left-0 right-0 flex items-center
            gap-3 px-4 cursor-move hover:bg-gray-50 dark:hover:bg-gray-800
            dark:border-gray-800"
            style={{ height: "40px", top: `${index * 40}px` }}
            draggable
          >
            <div
              className={`w-3 h-3 ${task.color} rounded-full flex-shrink-0`}
            ></div>
            <div className="flex-grow min-w-0">
              <p className="text--sm font-medium text-gray-900">{task.name}</p>
              <div className="flex items-center text-xs">
                <span>{formatTime(task.startHour)}</span>
                <span className="mx-1">-</span>
                <span>{formatTime(task.startHour + task.durationHours)}</span>
              </div>
            </div>
          </div>
        ))}
        <div
          className="absolute left-0 right-0 flex items-center gap-3 px-4
            text-gray-400 cursor-pointer hover:text-gray-600 transition-colors border-b"
          style={{
            height: "40px",
            top: `${tasks.length * 40}px`,
          }}
        >
          <div className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"></div>
          <p className="text-sm">Create Task</p>
        </div>
      </div>
    </div>
  );
}
