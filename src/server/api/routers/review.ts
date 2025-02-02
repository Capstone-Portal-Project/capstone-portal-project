"use server"

import { db } from "~/server/db"
import { reviews } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

const reviewFormSchema = z.object({
  u_id: z.number(),
  rating: z.number().min(1).max(5),
  comments: z.string().min(1),
})

export async function createReview(
  unsafeData: z.infer<typeof reviewFormSchema>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = reviewFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    await db.insert(reviews).values({
      u_id: data.u_id,
      rating: data.rating,
      comments: data.comments,
    }).execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to create review" }
  }
}

export async function getAllReviews() {
  try {
    const allReviews = await db.select().from(reviews)
    return { reviews: allReviews, error: false }
  } catch (error) {
    return { reviews: [], error: true, message: "Failed to fetch reviews" }
  }
}