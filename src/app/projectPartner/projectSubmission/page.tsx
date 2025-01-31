import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function ProjectSubmission() {
  return (
    <main>
      <div className="flex flex-col">
        <div className="h-auto flex flex-col items-center p-16">
          {/* <SignedIn> */}
            <form className="flex flex-col w-1/2 gap-4 bg-gray-100 p-6 rounded shadow-md">
              <label className="text-lg font-semibold">Project Title</label>
              <input type="text" className="border p-2 rounded" placeholder="Enter project title" />
              
              <label className="text-lg font-semibold">Project Partner Company</label>
              <input type="text" className="border p-2 rounded" placeholder="Enter partner company" />
              
              <label className="text-lg font-semibold">Video Link</label>
              <input type="url" className="border p-2 rounded" placeholder="Enter video link" />
              
              <label className="text-lg font-semibold">Project Description</label>
              <textarea className="border p-2 rounded" placeholder="Describe your project" rows={4}></textarea>
              
              <label className="text-lg font-semibold">Qualifications</label>
              <textarea className="border p-2 rounded" placeholder="List required qualifications" rows={3}></textarea>
              
              <label className="text-lg font-semibold">Objectives</label>
              <textarea className="border p-2 rounded" placeholder="Outline project objectives" rows={3}></textarea>
              
              <label className="text-lg font-semibold">Students Needed</label>
              <select className="border p-2 rounded">
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              
              <label className="text-lg font-semibold">Upload Project Images</label>
              <input type="file" className="border p-2 rounded" accept="image/*" multiple />
              
              <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Submit Project</button>
            </form>
          {/* </SignedIn> */}
        </div>
      </div>
    </main>
  );
}
