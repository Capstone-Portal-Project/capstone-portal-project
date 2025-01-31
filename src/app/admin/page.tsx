import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";


export const dynamic = "force-dynamic";


export default async function AdminPage() {
    const courses = await db.query.courses.findMany();

  return (
    <main className="">
        <SignedIn>
            <h1>Admin Dashboard</h1>
            <h2>Temp Links (put on sidebar)</h2>
            <ul>
                <li><a href='/admin/course-management'>Course Management</a></li>
            </ul>
      </SignedIn>
    </main>
  );
}