"use server"

import { db } from "~/server/db"
import { term } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

const courseFormSchema = z.object({
  u_id: z.number(),
  name: z.string(),
  term: z.string(),
  course_description: z.string(),
  is_archived: z.boolean().default(false),
})

export async function createCourse(
  unsafeData: z.infer<typeof courseFormSchema>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = courseFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    await db.insert(courses).values({
      u_id: data.u_id,
      name: data.name,
      term: data.term,
      course_description: data.course_description,
      is_archived: data.is_archived,
    }).execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to create course" }
  }
}

export async function getAllCourses() {
  try {
    const allCourses = await db.select().from(courses)
    return { courses: allCourses, error: false }
  } catch (error) {
    return { courses: [], error: true, message: "Failed to fetch courses" }
  }
}

export async function getActiveCourses() {
  try {
    const activeCourses = await db
      .select()
      .from(courses)
      .where(eq(courses.is_archived, false))
    return { courses: activeCourses, error: false }
  } catch (error) {
    return { courses: [], error: true, message: "Failed to fetch active courses" }
  }
}