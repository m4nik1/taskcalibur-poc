import prisma from "@/lib/prisma"
import HomePageClient from "@/components/HomePageClient";

export default async function HomePage() {
  const tasks = await prisma.userTasks.findMany();

  return (
    <HomePageClient taskDB={tasks}/>
  );
}
