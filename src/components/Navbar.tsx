import { Button } from "./ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default async function Navbar() {
  const viewOptions = ["Day"];
  // "Week"];

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  async function signOut() {
    "use server";
    await authClient.signOut({
      fetchOptions: {
        credentials: "include",
        onSuccess: () => {
          redirect("/signIn");
        },
        onError: (e) => {
          console.log("We have an error: ", e);
        },
      },
    });
    // redirect("/signIn");
  }

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
              variant="default"
              size="sm"
              className="px-3 py-1 text-sm"
            >
              {view}
            </Button>
          ))}
        </div>
        {!session ? (
          <Button>
            <Link href="/signIn">Sign In</Link>
          </Button>
        ) : (
          <Button onClick={signOut}>Sign Out</Button>
        )}
      </div>
    </div>
  );
}
