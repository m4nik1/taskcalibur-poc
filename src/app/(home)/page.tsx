import GantGrid from "@/components/gantt-grid";
import TaskList from "@/components/TaskList";

export default function HomePage() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex bg-gray-50">
        <TaskList />

        <GantGrid />
      </div>
    </div>
  );
}
