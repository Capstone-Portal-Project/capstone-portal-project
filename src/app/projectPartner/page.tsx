import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";


async function Projects() {
  const projects = await db.query.projects.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return (
    <div className="flex flex-wrap gap-4">
      {projects.map((project) => (
        <div key={project.id} className="flex w-48 flex-col">
          <img src={project.url} />
          <div>{project.name}</div>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
         Project Partner Home
        </div>
      </SignedOut>
      <SignedIn>
        <Projects />
      </SignedIn>
    </main>
  );
}