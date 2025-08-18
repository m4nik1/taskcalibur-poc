import { PrismaClient, Prisma } from "../generated/prisma/client.js";

const prisma = new PrismaClient()

const data : Prisma.userTasks[] = [
    {
        name: "Team Standup",
        status: "Scheduled",
        startTime: new Date("2024-08-18 14:00:00"),
        Duration: 30,
        EndTime: new Date("2024-08-18 14:30:00")
    },
    {
        name: "Project Review",
        status: "Completed",
        startTime: new Date("2024-08-18 10:00:00"),
        Duration: 120,
        EndTime: new Date("2024-08-18 10:00:00")
    },
    {
        name: "Client Call",
        status: "Scheduled",
        startTime: new Date("2024-08-18 15:00:00"),
        Duration: 60,
        EndTime: new Date("2024-08-18 16:00:00")
    },
]

export async function main() {
    for (const i of data) {
        await prisma.userTasks.create({ data: i })
    }
}

main()

/*

  id        Int      @id @default(autoincrement())
  name      String
  status    String
  startTime DateTime
  Duration  Int
  EndTime   DateTime

  {
      id: "1",
      name: "Team Standup",
      startHour: 9,
      durationHours: 0.5,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Project Review",
      startHour: 14,
      durationHours: 1,
      color: "bg-blue-500",
    },
    {
      id: "3",
      name: "Client Call",
      startHour: 16.5,
      durationHours: 1,
      color: "bg-blue-500",
    },
    {
      id: "4",
      name: "Code Review",
      startHour: 11,
      durationHours: 2,
      color: "bg-blue-500",
    },

*/