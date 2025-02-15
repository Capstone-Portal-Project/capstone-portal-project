"use server"

import { db } from "~/server/db"
import { savedProjects } from "~/server/db/schema"
import { z } from "zod"
import { eq, and } from "drizzle-orm"

/**
 * Schema for validating saved project data.
 */
const savedProjectSchema = z.object({
  userId: z.number(),
  projectId: z.number(),
  saveIndex: z.number(),
  preferenceDescription: z.string().optional()
})

/**
 * Creates a new saved project.
 * 
 * @param {z.infer<typeof savedProjectSchema>} unsafeData - The data to save the project with.
 * @returns {Promise<{ error: boolean; message?: string; saveId?: number }>} The result of the save operation.
 */
export async function createSavedProject(
  unsafeData: z.infer<typeof savedProjectSchema>
): Promise<{ error: boolean; message?: string; saveId?: number }> {
  const { success, data } = savedProjectSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    const result = await db.insert(savedProjects)
      .values(data)
      .returning({ saveId: savedProjects.saveId })
      .execute()

    return { 
      error: false, 
      saveId: result[0]?.saveId 
    }
  } catch (error) {
    return { error: true, message: "Failed to save project" }
  }
}

/**
 * Updates an existing saved project.
 * 
 * @param {number} saveId - The ID of the saved project to update.
 * @param {Partial<z.infer<typeof savedProjectSchema>>} unsafeData - The new data for the saved project.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateSavedProject(
  saveId: number,
  unsafeData: Partial<z.infer<typeof savedProjectSchema>>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = savedProjectSchema.partial().safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    await db.update(savedProjects)
      .set(data)
      .where(eq(savedProjects.saveId, saveId))
      .execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update saved project" }
  }
}

/**
 * Fetches all saved projects for a specific user.
 * 
 * @param {number} userId - The ID of the user to fetch saved projects for.
 * @returns {Promise<{ savedProjects: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getSavedProjectsByUser(userId: number) {
  try {
    const userSavedProjects = await db
      .select()
      .from(savedProjects)
      .where(eq(savedProjects.userId, userId))
      .orderBy(savedProjects.saveIndex)
    return { savedProjects: userSavedProjects, error: false }
  } catch (error) {
    return { savedProjects: [], error: true, message: "Failed to fetch saved projects" }
  }
}

/**
 * Deletes a saved project.
 * 
 * @param {number} saveId - The ID of the saved project to delete.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the deletion operation.
 */
export async function deleteSavedProject(saveId: number) {
  try {
    await db.delete(savedProjects)
      .where(eq(savedProjects.saveId, saveId))
      .execute()
    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to delete saved project" }
  }
}