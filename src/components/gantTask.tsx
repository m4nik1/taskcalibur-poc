import { TaskDB } from "../../types"
import { getXFromHour } from "@/lib/utils"

interface GantTaskProps {
    task: TaskDB;
    index: number;
}

export default function GantTask({ task, index }: GantTaskProps) {
    const HOUR_WIDTH_PX = 70; // Pixels per hour
    const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
    return (
        <div
            data-task-id={task.id}
            className={`absolute h-8 rounded active:cursor-grabbing flex items-center
              justify-between px-2 text-white font-medium bg-blue-500`}
            style={{
                left: getXFromHour(
                    task.startTime.getHours(),
                    HOUR_WIDTH_PX,
                    START_HOUR_DISPLAY
                ),
                width: (task.Duration/60) * HOUR_WIDTH_PX,
                top: `${index * 40 + 10}px`,
            }}
        >
            <span className="truncate pointer-events-none select-none">{task.name}</span>
            <div
                className="task-resizer w-3 h-full cursor-ew-resize absolute right-0 top-0"
                data-task-id={task.id}
            ></div>
        </div>
    )
}