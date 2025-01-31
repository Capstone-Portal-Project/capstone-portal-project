import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";


export const dynamic = "force-dynamic";


export default async function AdminPage() {
    const courses = await db.query.courses.findMany();

  return (
    <main className="">
        <SignedIn>
            <div className="text-center text-2xl mx-4">
            Signed in
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course, index) => (
                    <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.course_id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
      </SignedIn>
    </main>
  );
}