"use client";

import type React from "react";

import { useState, useEffect, type RefObject, useCallback } from "react";

interface DragStartInfo {}

export function useGanttDrag() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartInfo, setDragStartInfo] = useState<DragStartInfo | null>(
    null,
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if(e.button !== 0) return

      const target = e.target as HTMLElement
      const taskId = target.dataset.taskId
      const isResizer = target.classList.contains("task-resizer")

      if (taskId && gridRef.current) {
        const task = tasks.find((t) => t.id == taskId)

        if(task) {
          setIsDragging(true)
          setDragStartInfo({
            startX: e.clientX,
            startHour: task.startHour, // Initial start hour of the task
            taskId: taskId,
            isResizing: isResizer,
            initialDuration: task.durationHours,
            initialStartHour: task.startHour,
          })
        }
      }
      else if (gridRef.current) {
        const startHour = getHourFromX(e.clientX, gridRef, HOUR_WIDTH_PX, START_HOUR_DISPLAY)

        // setTempTask({
        //   name: "New Task",
        //   startHour: startHour,
        //   durationHours: 0.5,
        //   color: "bg-gray-500"
        // })
        setIsDragging(true)
        setDragStartInfo({
          startX: e.clientX,
          startHour: startHour,
          taskId: null, // Indicates new task creation
          isResizing: false,
        })
      }
    },
    [tasks, gridRef, HOUR_WIDTH_PX, START_HOUR_DISPLAY]
}
