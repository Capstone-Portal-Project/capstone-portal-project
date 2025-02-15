"use server"

import { db } from "~/server/db"
import { projectLog } from "~/server/db/schema"
import { z } from "zod"
import { eq, desc, and } from "drizzle-orm"

/**
 * Schema for validating project log form data.
 */
const projectLogFormSchema = z.object({
  projectId: z.number(),
  content: z.string().optional(),
  memo: z.string().optional(),
  userId: z.number(),
  projectLogType: z.enum([
    'submission',
    'deferment',
    'approval',
    'partner_message',
    'instructor_admin_message',
    'course_transfer'
  ])
})

/**
 * Creates a new project log.
 * 
 * @param {z.infer<typeof projectLogFormSchema>} unsafeData - The data to create the project log with.
 * @returns {Promise<{ error: boolean; message?: string; projectLogId?: number }>} The result of the creation operation.
 */
export async function createProjectLog(
  unsafeData: z.infer<typeof projectLogFormSchema>
): Promise<{ error: boolean; message?: string; projectLogId?: number }> {
  const { success, data } = projectLogFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    const result = await db.insert(projectLog)
      .values(data)
      .returning({ projectLogId: projectLog.projectLogId })
      .execute()

    return { 
      error: false, 
      projectLogId: result[0]?.projectLogId 
    }
  } catch (error) {
    return { error: true, message: "Failed to create project log" }
  }
}

/**
 * Fetches all logs for a specific project.
 * 
 * @param {number} projectId - The ID of the project to fetch logs for.
 * @returns {Promise<{ logs: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getProjectLogs(projectId: number) {
  try {
    const logs = await db
      .select()
      .from(projectLog)
      .where(eq(projectLog.projectId, projectId))
      .orderBy(desc(projectLog.dateCreated))
    return { logs, error: false }
  } catch (error) {
    return { logs: [], error: true, message: "Failed to fetch project logs" }
  }
}

/**
 * Fetches logs of a specific type for a specific project.
 * 
 * @param {number} projectId - The ID of the project to fetch logs for.
 * @param {z.infer<typeof projectLogFormSchema>["projectLogType"]} type - The type of logs to fetch.
 * @returns {Promise<{ logs: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getProjectLogsByType(projectId: number, type: z.infer<typeof projectLogFormSchema>["projectLogType"]) {
  try {
    const logs = await db
      .select()
      .from(projectLog)
      .where(
        and(
          eq(projectLog.projectId, projectId),
          eq(projectLog.projectLogType, type)
        )
      )
      .orderBy(desc(projectLog.dateCreated))
    return { logs, error: false }
  } catch (error) {
    return { logs: [], error: true, message: "Failed to fetch project logs" }
  }
}

/**
 * Updates an existing project log.
 * 
 * @param {number} projectLogId - The ID of the project log to update.
 * @param {Partial<z.infer<typeof projectLogFormSchema>>} unsafeData - The new data for the project log.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateProjectLog(
  projectLogId: number,
  unsafeData: Partial<z.infer<typeof projectLogFormSchema>>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = projectLogFormSchema.partial().safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    await db.update(projectLog)
      .set(data)
      .where(eq(projectLog.projectLogId, projectLogId))
      .execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update project log" }
  }
}

/**
 * Deletes a project log.
 * 
 * @param {number} projectLogId - The ID of the project log to delete.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the deletion operation.
 */
export async function deleteProjectLog(projectLogId: number) {
  try {
    await db.delete(projectLog)
      .where(eq(projectLog.projectLogId, projectLogId))
      .execute()
    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to delete project log" }
  }
}