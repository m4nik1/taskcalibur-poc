import { clsx, type ClassValue } from "clsx"
import { RefObject } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHourFromX(
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