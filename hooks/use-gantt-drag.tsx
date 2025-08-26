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
            initialStartHour: task.startTime.getHours(),
          });
        }
      } else if (gridRef.current) {
        const startHour = getHourFromX(
          e.clientX,
          gridRef,
          HOUR_WIDTH_PX,
          START_HOUR_DISPLAY
        );

        // setTempTask({
        //   name: "New Task",
        //   startHour: startHour,
        //   durationHours: 0.5,
        //   color: "bg-gray-500"
        // })
        setIsDragging(true);
        setDragStartInfo({
          startX: e.clientX,
          startHour: startHour,
          taskId: null, // Indicates new task creation
          isResizing: false,
        });
      }
    },
    [tasks, gridRef, HOUR_WIDTH_PX, START_HOUR_DISPLAY]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragStartInfo) {
      if (dragStartInfo.taskId === null && tempTask) {
        setTasks((prevTasks) => [
          ...prevTasks,
        ]);
      }
      setIsDragging(false);
      setDragStartInfo(null);
      setTempTask(null);
    }
  }, [isDragging, dragStartInfo, tempTask, setTasks]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartInfo || !gridRef.current) return;

      const currentHour = getHourFromX(
        e.clientX,
        gridRef,
        HOUR_WIDTH_PX,
        START_HOUR_DISPLAY
      );

      if (dragStartInfo.taskId === null) {
        // if(tempTask) {
        //   const newDuration = Math.max(0.5, currentHour - tempTask.startHour)
        //   setTempTask((prev) => (prev ? { ...prev, durationHours: newDuration } : null))
        // }
      } else {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            // console.log("Task moving: ", task)
            if (task.id.toString() === dragStartInfo.taskId) {
              if (dragStartInfo.isResizing) {
                // Resizing from the right edge - constrain end time
                const maxEndHour = END_HOUR_DISPLAY;
                const newDuration = Math.max(
                  0.5,
                  Math.min(
                    currentHour - task.startTime.getHours(),
                    maxEndHour - task.startTime.getHours()
                  )
                );
                return { ...task, Duration: newDuration*60 };
              } else {
                // Moving the task - constrain within grid boundaries
                const deltaX = e.clientX - dragStartInfo.startX;
                const deltaHours = deltaX / HOUR_WIDTH_PX;
                let newStartHour = dragStartInfo.initialStartHour! + deltaHours;

                // Constrain start hour to not go before START_HOUR_DISPLAY
                newStartHour = Math.max(START_HOUR_DISPLAY, newStartHour);

                // Constrain end hour to not go beyond END_HOUR_DISPLAY
                const taskEndHour = newStartHour + task.Duration / 60;
                if (taskEndHour > END_HOUR_DISPLAY) {
                  newStartHour = END_HOUR_DISPLAY - task.Duration / 60;
                }

                task.startTime.setHours(Math.round(newStartHour * 4)/4);
                // task.EndTime.setHours(newStartHour + task.Duration / 60);

                return {
                  ...task,
                };
              }
            }
            return task;
          })
        );
      }
    },
    [
      isDragging,
      dragStartInfo,
      setTasks,
      gridRef,
      HOUR_WIDTH_PX,
      START_HOUR_DISPLAY,
      END_HOUR_DISPLAY,
    ]
  );

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
