import { createTRPCRouter, publicProcedure } from "~/trpc/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { reviews } from "~/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Router for review-related operations.
 * 
 * This router handles CRUD operations for reviews, including fetching all reviews,
 * fetching a review by ID, creating a new review, and deleting a review.
 */
export const reviewRouter = createTRPCRouter({
  /**
   * Fetch all reviews.
   */
  getAll: publicProcedure.query(async () => {
    return db.select().from(reviews);
  }),

  /**
   * Fetch a review by ID.
   */
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return db.select().from(reviews).where(reviews.review_id.eq(input)).first();
  }),

  /**
   * Create a new review.
   */
  create: publicProcedure.input(z.object({
    u_id: z.number(),
    track_id: z.number(),
    rating: z.number(),
    comments: z.string(),
  })).mutation(async ({ input }) => {
    return db.insert(reviews).values(input).returning("*").first();
  }),

  /**
   * Delete a review by ID.
   */
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    return db.delete(reviews).where(eq(reviews.review_id, input)).returning("*").first();
  }),
});