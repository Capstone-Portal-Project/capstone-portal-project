"use server"

import { db } from "~/server/db"
import { sequences } from "~/server/db/schema"
import { z } from "zod"
import { desc, eq } from "drizzle-orm"

/**
 * Schema for validating sequence form data.
 */
const sequenceFormSchema = z.object({
  type: z.enum(['iterated', 'repeated']),
  description: z.string(),
  showReportsToStudent: z.boolean()
})

/**
 * Get a sequence by ID.
 * 
 * @param {number} sequenceId - The ID of the sequence to fetch.
 * @returns {Promise<{ error: boolean; message?: string; sequence?: any }>} The result of the fetch operation.
 */
export async function getSequenceById(sequenceId: number) {
  try {
    const sequence = await db.select()
        .from(sequences)
        .where(eq(sequences.sequenceId, sequenceId))
        .execute()
    return { sequence: sequence[0], error: false }
  } catch (error) {
    return { sequence: undefined, error: true, message: "Failed to fetch sequence" }
  }
}