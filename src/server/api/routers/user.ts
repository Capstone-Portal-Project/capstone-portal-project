import { createTRPCRouter, publicProcedure } from "~/trpc/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

type UserInput = z.infer<typeof userInput>;
type UserUpdateInput = z.infer<typeof userUpdateInput>;

const userInput = z.object({
  u_name: z.string().min(1),
  email: z.string().email(),
});

const userUpdateInput = z.object({
  u_id: z.number(),
  u_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

/**
 * Router for user-related operations.
 * 
 * This router handles CRUD operations for users, including fetching all users,
 * fetching a user by ID, creating a new user, updating an existing user, and deleting a user.
 */
export const userRouter = createTRPCRouter({
  /**
   * Fetch all users.
   */
  getAll: publicProcedure.query(async () => {
    return db.select().from(users);
  }),

  /**
   * Fetch a user by ID.
   */
  getById: publicProcedure
    .input(z.number())
    .query(async ({ input }: { input: number }) => {
      const result = await db.select()
        .from(users)
        .where(eq(users.u_id, input));
      return result[0];
    }),

  /**
   * Create a new user.
   */
  create: publicProcedure
    .input(userInput)
    .mutation(async ({ input }: { input: UserInput }) => {
      const result = await db.insert(users)
        .values(input)
        .returning();
      return result[0];
    }),

  /**
   * Update an existing user.
   */
  update: publicProcedure
    .input(userUpdateInput)
    .mutation(async ({ input }: { input: UserUpdateInput }) => {
      const { u_id, ...updateData } = input;
      const result = await db.update(users)
        .set(updateData)
        .where(eq(users.u_id, u_id))
        .returning();
      return result[0];
    }),

  /**
   * Delete a user by ID.
   */
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }: { input: number }) => {
      const result = await db.delete(users)
        .where(eq(users.u_id, input))
        .returning();
      return result[0];
    }),
});