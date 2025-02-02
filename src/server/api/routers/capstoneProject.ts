"use server"

import { db } from "~/server/db"
import { capstoneProjects, capstoneProjectCourses } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

const projectFormSchema = z.object({
  cp_title: z.string().min(2).max(256),
  cp_description: z.string().min(10),
  cp_objectives: z.string().min(10),
  course_ids: z.array(z.number()).min(1),
  cp_image: z.string().optional(),
})

export async function createProject(
  unsafeData: z.infer<typeof projectFormSchema>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = projectFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    const projectResult = await db.insert(capstoneProjects).values({
      cp_title: data.cp_title,
      cp_description: data.cp_description,
      cp_objectives: data.cp_objectives,
      cp_image: data.cp_image ?? "",
      cp_archived: false,
      course_id: data.course_ids[0] as number,
    }).returning().execute()

    if (!projectResult[0]) {
      throw new Error("Failed to create project")
    }

    const projectId = projectResult[0].cp_id

    await Promise.all(data.course_ids.map(courseId => 
      db.insert(capstoneProjectCourses).values({
        cp_id: projectId,
        course_id: courseId,
      }).execute()
    ))

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to create project" }
  }
}

export async function getAllProjects() {
  try {
    const projects = await db.select().from(capstoneProjects)
    return { projects, error: false }
  } catch (error) {
    return { projects: [], error: true, message: "Failed to fetch projects" }
  }
}

export async function getActiveProjects() {
  try {
    const projects = await db
      .select()
      .from(capstoneProjects)
      .where(eq(capstoneProjects.cp_archived, false))
    return { projects, error: false }
  } catch (error) {
    return { projects: [], error: true, message: "Failed to fetch active projects" }
  }
}

export async function getArchivedProjects() {
  try {
    const projects = await db
      .select()
      .from(capstoneProjects)
      .where(eq(capstoneProjects.cp_archived, true))
    return { projects, error: false }
  } catch (error) {
    return { projects: [], error: true, message: "Failed to fetch archived projects" }
  }
}