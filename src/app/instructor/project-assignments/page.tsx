import React from 'react'
import { DataTableUser, columns } from "./columns"
import { DataTable } from "./data-table"
import { auth } from "@clerk/nextjs/server";
import { getStudentsByProgram } from "../../../server/api/routers/user";

async function getData(): Promise<DataTableUser[]> {

    // Get the current user.
    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn()

    // Get the program that the logged in user is an instructor for.
    const programId = 5;

    // Get all students for that program.
    const { users, error, message } = await getStudentsByProgram(programId)

    // Extract the userId, username, and email from the users into a new array.
    const students = users.map((user) => {
        return {
            id: user.userId,
            username: user.username,
            email: user.email,
        }
    })

  return students;
}

export default async function ProjectAssignments() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
