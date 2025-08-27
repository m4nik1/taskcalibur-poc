"use client";

import { useState, type RefObject, useCallback, useEffect } from "react";
import { TaskDB } from "../types";
import { getHourFromX } from "@/lib/utils";

interface DragStartInfo {
  startX: number;
  startHour: number;
  taskId: string | null;
  isResizing: boolean;
  initialDuration?: number;
  initialStartHour?: number;
}

interface UseGanttDragProps {
  tasks: TaskDB[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  gridRef: RefObject<HTMLDivElement>;
  HOUR_WIDTH_PX: number;
  START_HOUR_DISPLAY: number;
  END_HOUR_DISPLAY: number;
}

export function useGanttDrag({
  tasks,
  setTasks,
  gridRef,
  HOUR_WIDTH_PX,
  START_HOUR_DISPLAY,
  END_HOUR_DISPLAY,
}: UseGanttDragProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartInfo, setDragStartInfo] = useState<DragStartInfo | null>(
    null
  );
  const [tempTask, setTempTask] = useState<Omit<TaskDB, "id"> | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) {
        return;
      }
      const target = e.target as HTMLElement;
      const taskId = target.dataset.taskId;
      const isResizer = target.classList.contains("task-resizer");

      if (taskId && gridRef.current) {
        const task = tasks.find((t) => t.id.toString() == taskId);

        if (task) {
          setIsDragging(true);
          setDragStartInfo({
            startX: e.clientX,
            startHour: task.startTime.getHours(), // Initial start hour of the task
            taskId: taskId.toString(),
            isResizing: isResizer,
            initialDuration: task.Duration / 60,
            initialStartHour: task.startTime.getHours() + (task.startTime.getMinutes() / 60),
          });
          setDragOffset(0);
        }
      }
    },
    [tasks, gridRef]
  );

  // When the mouse is moving just get the event's x and drag start x
  // This only happens if mouse is clicked over a task and moving
  // Then calculate the offset of hours of that task
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartInfo || !gridRef.current) return;

      const deltaX = e.clientX - dragStartInfo.startX;
      const deltaHours = deltaX / HOUR_WIDTH_PX;

      setDragOffset(deltaHours)
    },
    [
      isDragging,
      dragStartInfo,
      HOUR_WIDTH_PX,
    ]
  );

  // When the mouse is up we will stop the dragging and set the task stuff
  const handleMouseUp = useCallback(() => {
    if (isDragging && dragStartInfo) {
      
    }
  }, [isDragging, dragStartInfo]);



  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { isDragging, dragStartInfo, tempTask, handleMouseDown };
}
