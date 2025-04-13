"use server"

import { db } from "~/server/db"
import { term } from "~/server/db/schema"

/**
 * Fetches all terms.
 * 
 * @returns {Promise<{ terms: any[]; error: boolean; message?: string }>}
 */
export async function getAllTerms() {
  try {
    const allTerms = await db.select().from(term)
    return { terms: allTerms, error: false }
  } catch (error) {
    return { terms: [], error: true, message: "Failed to fetch terms" }
  }
} 