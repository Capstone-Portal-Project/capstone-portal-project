import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main>
      <div className="flex flex-col">
        <div className="h-[40vh] bg-gray-800">
          <SignedOut>
            <div className="flex flex-col text-white p-32 gap-4">
              <h1 className="text-6xl text-center">Where Education Meets Application</h1>
              <h2 className="text-2xl text-center">Show employers you have what it takes.</h2>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="h-full w-full text-center text-2xl">
              Welcome to the Capstone Project Portal
            </div>
          </SignedIn>
        </div>
        <div className="h-[40vh] ">
          <div className="flex flex-col p-16">
            <p className="text-center">The Oregon State University EECS Project Showcase assists students in obtaining internships and full-time employment by providing the opportunity to build a portfolio of projects they have completed.</p>
          </div>
        </div>
      </div>
    </main>
  );
}