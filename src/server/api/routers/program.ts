"use server"

import { db } from "~/server/db"
import { programs } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

/**
 * Schema for validating program form data.
 */
const programFormSchema = z.object({
  programName: z.string().min(2).max(256),
  programDescription: z.string().optional(),
  programStatus: z.enum(['submissions', 'matching', 'active', 'ending', 'archived', 'hidden']),
  startTermId: z.number(),
  endTermId: z.number()
})

/**
 * Creates a new program.
 * 
 * @param {z.infer<typeof programFormSchema>} unsafeData - The data to create the program with.
 * @returns {Promise<{ error: boolean; message?: string; programId?: number }>} The result of the creation operation.
 */
export async function createProgram(
  unsafeData: z.infer<typeof programFormSchema>
): Promise<{ error: boolean; message?: string; programId?: number }> {
  const { success, data } = programFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    const result = await db.insert(programs)
      .values(data)
      .returning({ programId: programs.programId })
      .execute()

    return { 
      error: false, 
      programId: result[0]?.programId 
    }
  } catch (error) {
    return { error: true, message: "Failed to create program" }
  }
}

/**
 * Fetches all programs.
 * 
 * @returns {Promise<{ programs: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getAllPrograms() {
  try {
    const allPrograms = await db.select().from(programs)
    return { programs: allPrograms, error: false }
  } catch (error) {
    return { programs: [], error: true, message: "Failed to fetch programs" }
  }
}

/**
 * Fetches all active programs.
 * 
 * @returns {Promise<{ programs: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getActivePrograms() {
  try {
    const activePrograms = await db
      .select()
      .from(programs)
      .where(eq(programs.programStatus, 'active'))
    return { programs: activePrograms, error: false }
  } catch (error) {
    return { programs: [], error: true, message: "Failed to fetch active programs" }
  }
}

/**
 * Updates the status of a program.
 * 
 * @param {number} programId - The ID of the program to update.
 * @param {z.infer<typeof programFormSchema>["programStatus"]} status - The new status of the program.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateProgramStatus(
  programId: number,
  status: z.infer<typeof programFormSchema>["programStatus"]
): Promise<{ error: boolean; message?: string }> {
  try {
    await db.update(programs)
      .set({ programStatus: status })
      .where(eq(programs.programId, programId))
      .execute()
    
    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update program status" }
  }
}