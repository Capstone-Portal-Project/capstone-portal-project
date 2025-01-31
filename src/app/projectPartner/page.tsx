import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function ProjectPartner() {
  return (
    <main>
      <div className="flex flex-col">
        <div className="h-[40vh] bg-gray-800">
          <SignedOut>
            <div className="flex flex-col text-white p-32 gap-4">
              <h1 className="text-6xl text-center">Submit Your Project</h1>
              <h2 className="text-2xl text-center">Join us in shaping the future of innovation.</h2>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="h-full w-full flex flex-col items-center justify-center text-2xl text-white">
              <h1 className="text-4xl">Project Submission Portal</h1>
              <p className="text-lg mt-4">Submit your project details to collaborate with students.</p>
            </div>
          </SignedIn>
        </div>
        <div className="h-[40vh] ">
          <div className="flex flex-col p-16">
            <p className="text-center">
              The Oregon State University EECS Project Showcase allows project partners to collaborate with students by submitting project proposals, providing mentorship, and engaging with upcoming talent.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
