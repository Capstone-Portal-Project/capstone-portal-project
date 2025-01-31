import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function ProjectSubmission() {
  return (
    <main>
      <div className="flex flex-col items-center p-16">
        <form className="grid grid-cols-3 gap-8 bg-gray-100 p-6 rounded shadow-md w-2/3">
          {/* Row 1 */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold">Project Title</label>
            <input type="text" className="border p-2 rounded" placeholder="Enter project title" />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold">Partner Company</label>
            <input type="text" className="border p-2 rounded" placeholder="Enter partner company" />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold">Video Link</label>
            <input type="url" className="border p-2 rounded" placeholder="Enter video link" />
          </div>
          
          {/* Row 2 */}
          <div className="col-span-3">
            <label className="text-lg font-semibold">Project Description</label>
            <textarea className="border p-2 rounded w-full" placeholder="Describe your project" rows={4}></textarea>
          </div>
          
          {/* Row 3 */}
          <div className="col-span-3">
            <label className="text-lg font-semibold">Qualifications</label>
            <textarea className="border p-2 rounded w-full" placeholder="List required qualifications" rows={3}></textarea>
          </div>
          
          {/* Row 4 */}
          <div className="col-span-3">
            <label className="text-lg font-semibold">Objectives</label>
            <textarea className="border p-2 rounded w-full" placeholder="Outline project objectives" rows={3}></textarea>
          </div>
          
          {/* Row 5 */}
          <div className="col-span-3 flex flex-col">
            <label className="text-lg font-semibold">Students Needed</label>
            <select className="border p-2 rounded w-1/4">
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          
          {/* Row 6 */}
          <div className="col-span-3 flex flex-col">
            <label className="text-lg font-semibold">Upload Project Images</label>
            <input type="file" className="border p-2 rounded" accept="image/*" multiple />
          </div>
          
          {/* Submit Button */}
          <div className="col-span-3 flex justify-center mt-4">
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Submit Project
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
