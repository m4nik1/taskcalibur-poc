"use client"

import { useState, useRef, useEffect } from "react"
import { useGanttDrag } from "../../hooks/use-gantt-drag";
import { TaskDB } from "../../types";
import TaskList from "./TaskList";
import GantGrid from "./gantt-grid";
import { Button } from "./ui/button";


interface HomeProps {
    taskDB: TaskDB[]
}

export default function HomePageClient({ taskDB } : HomeProps) {
    // Constants for Gantt chart scaling
    const HOUR_WIDTH_PX = 70; // Increased width to accommodate time labels better
    const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
    const END_HOUR_DISPLAY = 25; // End time for the visible grid (1 AM next day, 24 + 1 = 25)

    const gridRef = useRef<HTMLDivElement>(null!);
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);

    const [tasks, setTasks] = useState<TaskDB[]>(taskDB);

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

    // useEffect(() => {
    //     console.log("Tasks loaded ", tasks)
    // })
    
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