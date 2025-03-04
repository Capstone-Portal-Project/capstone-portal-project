"use server"

import { db } from "~/server/db"
import { homepageContent } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

/**
 * Schema for validating homepage content form data.
 */
const homeSchema = z.object({
    heroTitle: z.string().min(2).max(256),
    heroSubtitle: z.string().min(2).max(256),
    mainContent: z.string().min(2)
})

/**
 * Updates the homepage content.
 */
export async function updateHomepageContent(unsafeData: z.infer<typeof homeSchema>) {
    const { success, data } = homeSchema.safeParse(unsafeData)

    if (!success) {
        return { error: true, message: "Invalid data" }
    }

    try {
        await db.update(homepageContent)
            .set(data)
            .execute()

        return { error: false }
    } catch (error) {
        return { error: true, message: "Failed to update homepage content" }
    }
}

/**
 * Fetches the homepage content.
 */
export async function getHomepageContent() {
    try {
        const content = await db.select().from(homepageContent)
        return { content: content[0], error: false }
    } catch (error) {
        return { content: null, error: true, message: "Failed to fetch homepage content" }
    }
}