"use client";

import { useRef, useState, RefObject } from "react";

export default function GantGrid() {
  const HOUR_WIDTH_PX = 60; // Pixels per hour
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
  const END_HOUR_DISPLAY = 26; // End time for the visible grid (2 AM next day, 24 + 2 = 26)
  const TOTAL_DISPLAY_HOURS = END_HOUR_DISPLAY - START_HOUR_DISPLAY;

  interface Task {
    id: string;
    name: string;
    startHour: number;
    durationHours: number;
    color: string;
  }

  function formatDate(date: Date) {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${days[date.getDay()]}, ${
      months[date.getMonth()]
    } ${date.getDate()}`;
  }

  const gridRef = useRef<HTMLDivElement>(null);

  function getXFromHour(
    hour: number,
    HOUR_WIDTH_PX: number,
    START_HOUR_DISPLAY: number
  ) {
    return (hour - START_HOUR_DISPLAY) * HOUR_WIDTH_PX;
  }

  const timeLabels = Array.from({ length: TOTAL_DISPLAY_HOURS + 1 }, (_, i) => {
    const hour = START_HOUR_DISPLAY + i;
    if (hour === 24) return "12AM";
    if (hour === 25) return "1AM";
    if (hour === 26) return "2AM";
    return `${hour % 12 === 0 ? 12 : hour % 12}${
      hour < 12 || hour >= 24 ? "AM" : "PM"
    }`;
  });

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

  function getHourFromX(
    clientX: number,
    gridRef: RefObject<HTMLDivElement>,
    HOUR_WIDTH_PX: number,
    START_HOUR_DISPLAY: number
  ) {
    if (!gridRef.current) return 0;
    const gridRect = gridRef.current.getBoundingClientRect();
    const xInGrid = clientX - gridRect.left;
    return START_HOUR_DISPLAY + xInGrid / HOUR_WIDTH_PX;
  }

  const currentTime = new Date();

  const currentHourInDay =
    currentTime.getHours() + currentTime.getMinutes() / 60;

  const currentTimeLinePos = getXFromHour(
    currentHourInDay,
    HOUR_WIDTH_PX,
    START_HOUR_DISPLAY
  );

  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 25)); // July 25, 2025

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Date Navi */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div>
          <div className="bg-black text-white px-2 py-1 rounded text-sm font-medium ease-out">
            {formatDate(currentDate)}
          </div>
          <button className="p-1 hover-bg-gray-200 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor">
              <path
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 101-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div
          className="flex-1 grid"
          style={{
            gridTemplateColumns: `repeat(${TOTAL_DISPLAY_HOURS}, ${HOUR_WIDTH_PX}px)`,
          }}
        >
          {timeLabels.map((label, index) => (
            <div
              key={index}
              className="text-xs text-center text-gray-600 font-medium py-2 border-b"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid With tasks */}
      <div
        ref={gridRef}
        className="flex-1 relative overflow-auto bg-white"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        style={{
          minWidth: `${TOTAL_DISPLAY_HOURS * HOUR_WIDTH_PX}px`,
          backgroundSize: `${HOUR_WIDTH_PX}px 100%`,
          backgroundImage: `linear-gradient(to right, #f3f4f6 1px, transparent 1px)`,
        }}
      >
        <style jsx>{`
          .dark .flex-1.relative {
            background-image: linear-gradient(
              to rigt,
              #374151 1px,
              transparent 1px
            );
          }
        `}</style>
        {tasks.map((task, index) => (
          <div
            key={task.id}
            data-task-id={task.id}
            className={`absolute h-8 rounded cursor-grad active:cursor-grabbing flex items-center
              justify-between px-2 text-white font-medium ${task.color}`}
            style={{
              left: getXFromHour(
                task.startHour,
                HOUR_WIDTH_PX,
                START_HOUR_DISPLAY
              ),
              width: task.durationHours * HOUR_WIDTH_PX,
              top: `${index * 40 + 10}px`,
            }}
          >
            <span className="truncate">{task.name}</span>
            <div
              className="task-resizer w-3 h-full cursor-ew-resize absolute right-0 top-0"
              data-task-id={task.id}
            ></div>
          </div>
        ))}

        {Array.from({ length: tasks.length + 10 }, (_, i) => (
          <div
            key={`row-line-${i}`}
            className="absolute left-0 right-0 border-b border-gray-100"
            style={{ top: `${i * 40 + 40}px` }}
          ></div>
        ))}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
          style={{ left: currentTimeLinePos }}
        >
          <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
