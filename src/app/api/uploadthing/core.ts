import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "~/server/db";
import { project } from "~/server/db/schema";
import { users } from "~/server/db/schema";

/**
 * Middleware to check if the user is authenticated.
 * 
 * This middleware runs on your server before processing the request.
 * If the user is not authenticated, it throws an error.
 * 
 * @param req - The incoming request object.
 * @returns The user ID if authenticated.
 */
export const checkAuth = async (req: Request) => {
  const user = auth();

  // If the user is not authenticated, throw an error
  if (!(await user).userId) throw new Error("Unauthorized");

  // Return the user ID
  return { userId: (await user).userId };
};

/**
 * Example function to handle a request after authentication.
 * 
 * This function runs on your server after the user is authenticated.
 * It can be used to perform any server-side logic, such as fetching user data.
 * 
 * @param userId - The authenticated user ID.
 * @returns The user data.
 */
export const handleRequest = async (userId: string) => {
  // Fetch user data from the database
  const user = await db.select().from(users).where(users.u_id.eq(userId)).first();

  // Return the user data
  return user;
};

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;