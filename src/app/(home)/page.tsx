import prisma from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const tasks = await prisma.userTasks.findMany();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.log(session);
    // return <div>Not Authenticated</div>;
  }

  // const tasks = await prisma.userTasks.findMany();
  // const tasks = await prisma.userTasks.findMany({
  //   where: {
  //     userId:
  //   }
  // });

  return <HomePageClient taskDB={tasks} />;
}
