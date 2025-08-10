"use client";

import { useState, RefObject } from "react";
import { Task } from "../../types";

interface gantGridProps {
  setTasks: React.SetStateAction<Task[]>;
  tasks: Task[];
  gridRef: RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
  draggedTaskFromList: string | null;
}

export default function GantGrid({
  setTasks,
  tasks,
  gridRef,
  handleMouseDown,
  draggedTaskFromList,
}: gantGridProps) {
  const HOUR_WIDTH_PX = 70; // Pixels per hour
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
  const END_HOUR_DISPLAY = 24; // End time for the visible grid (2 AM next day, 24 + 2 = 26)
  const TOTAL_DISPLAY_HOURS = END_HOUR_DISPLAY - START_HOUR_DISPLAY;
  const TOTAL_DISPLAY_TIME = 20;

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

  // const gridRef = useRef<HTMLDivElement>(null);

  function getXFromHour(
    hour: number,
    HOUR_WIDTH_PX: number,
    START_HOUR_DISPLAY: number,
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

  function getHourFromX(
    clientX: number,
    gridRef: RefObject<HTMLDivElement>,
    HOUR_WIDTH_PX: number,
    START_HOUR_DISPLAY: number,
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
    START_HOUR_DISPLAY,
  );

  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 5));
  const [draggedTaskFromList, setDraggedTaskFromList] = useState<string | null>(
    null,
  );

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
            gridTemplateColumns: `repeat(${TOTAL_DISPLAY_TIME}, ${HOUR_WIDTH_PX}px)`,
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
        onMouseDown={handleMouseDown}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedTaskFromList) {
            const dropHour = getHourFromX(
              e.clientX,
              gridRef,
              HOUR_WIDTH_PX,
              START_HOUR_DISPLAY,
            );
            setTasks((prevTasks) => {
              prevTasks.map((task) =>
                task.id === draggedTaskFromList
                  ? { ...task, startHour: dropHour }
                  : task,
              );
            });
            setDraggedTaskFromList(null);
          }
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
                START_HOUR_DISPLAY,
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
