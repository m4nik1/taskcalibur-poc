import { TaskDB } from "../../types";
import { getXFromHour } from "@/lib/utils";

interface GantTaskProps {
  task: TaskDB;
  index: number;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  dragStartInfo: { taskId: number | null } | null;
}

export default function GantTask({
  task,
  index,
  handleMouseDown,
  handleMouseUp,
  dragStartInfo,
}: GantTaskProps) {
  const HOUR_WIDTH_PX = 70; // Pixels per hour
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)

  const isActive = dragStartInfo?.taskId === task.id?.toString();

  return (
    <div
      data-task-id={task.id}
      className={`absolute h-8 rounded select-none active:cursor-grabbing flex items-center
              justify-between px-2 text-white font-medium bg-blue-500`}
      style={{
        left: `${
          (task.startTime.getHours() - START_HOUR_DISPLAY) * HOUR_WIDTH_PX
        }px`,
        width: (task.Duration / 60) * HOUR_WIDTH_PX,
        top: `${index * 40 + 10}px`,
        transition: isActive ? "none" : "transform 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <span className="truncate pointer-events-none select-none">
        {task.name}
      </span>
      <div
        className="task-resizer w-3 h-full cursor-ew-resize absolute right-0 top-0"
        data-task-id={task.id}
      ></div>
    </div>
  );
}
