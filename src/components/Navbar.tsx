"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "lucide-react";

export default function Navbar() {
  const viewOptions = ["Day", "Week"];

  const [selectedView, setSelectView] = useState("Day");

  return (
    <div
      className="bg-white dark-gray-900 border-b border-gray-200 
    dark:border px-6 py-4 flex justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white"></Calendar>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Taskcalibur</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="gap-1 bg-gray-100 dark:bg-gray-800 
          rounded-lg p-1 shadow-inner"
        >
          {viewOptions.map((view, index) => (
            <Button
              key={index}
              variant={selectedView === view ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectView(view)}
              className="px-3 py-1 text-sm"
            >
              {view}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
