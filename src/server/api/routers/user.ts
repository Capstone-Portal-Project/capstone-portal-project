"use server"

import { db } from "~/server/db"
import { users } from "~/server/db/schema"
import { z } from "zod"
import { eq, and } from "drizzle-orm"
import { addUserToOrganization, removeUserFromOrganization } from "~/server/auth/clerk-admin"

/**
 * Schema for validating user form data.
 */
const userFormSchema = z.object({
  username: z.string().min(2).max(256),
  email: z.string().email().max(256),
  type: z.enum(['project_partner', 'student', 'instructor', 'admin']),
  programId: z.number().optional(),
  rankingSubmitted: z.boolean().default(false),
  teamId: z.number().optional(),
  projectId: z.number().optional(),
  clerk_user_id: z.string().max(256)
})

/**
 * Creates a new user.
 * 
 * @param {z.infer<typeof userFormSchema>} unsafeData - The data to create the user with.
 * @returns {Promise<{ error: boolean; message?: string; userId?: number }>} The result of the creation operation.
 */
export async function createUser(
  unsafeData: z.infer<typeof userFormSchema>
): Promise<{ error: boolean; message?: string; userId?: number }> {
  const { success, data } = userFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    const result = await db.insert(users)
      .values(data)
      .returning({ userId: users.userId })
      .execute()

    return { 
      error: false, 
      userId: result[0]?.userId 
    }
  } catch (error) {
    return { error: true, message: "Failed to create user" }
  }
}

/**
 * Updates an existing user.
 * 
 * @param {number} userId - The ID of the user to update.
 * @param {Partial<z.infer<typeof userFormSchema>>} unsafeData - The new data for the user.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateUser(
  userId: number,
  unsafeData: Partial<z.infer<typeof userFormSchema>>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = userFormSchema.partial().safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    await db.update(users)
      .set(data)
      .where(eq(users.userId, userId))
      .execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update user" }
  }
}

/**
 * Updates an existing instructor. Same as updateUser but if
 * the programId can be set to null.
 * 
 * @param {number} userId - The ID of the user to update.
 * @param {Partial<z.infer<typeof userFormSchema>>} unsafeData - The new data for the user.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateInstructor(
  userId: number,
  unsafeData: Partial<z.infer<typeof userFormSchema>>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = userFormSchema.partial().safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
      // Ensure `programId` is explicitly set to `null` if undefined
      const sanitizedData = {
        ...data,
        programId: data.programId === undefined ? null : data.programId
      }

      // Remove user affiliation from the last ogranization if applicable
      const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, userId))
        .limit(1)

      if (user && user.length > 0) {
        const programId = user[0]?.programId
        const clerkUserId = user[0]?.clerk_user_id
        
        if (clerkUserId && programId) {
          await removeUserFromOrganization(programId, clerkUserId)
        }

        // If program ID is not null, add the instructor to the new organization
        if (sanitizedData.programId !== null && clerkUserId) {
          await addUserToOrganization(sanitizedData.programId, clerkUserId, 'org:instructor')
        }
      } else {
        console.error(`User with ID ${userId} not found`)
      }

    await db.update(users)
      .set(sanitizedData)
      .where(eq(users.userId, userId))
      .execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update user" }
  }
}

/**
 * Fetches all users.
 * 
 * @returns {Promise<{ users: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getAllUsers() {
  try {
    const allUsers = await db.select().from(users)
    return { users: allUsers, error: false }
  } catch (error) {
    return { users: [], error: true, message: "Failed to fetch users" }
  }
}

/**
 * Fetches a user by their email.
 * 
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<{ user: any; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    return { user: user[0], error: false }
  } catch (error) {
    return { user: null, error: true, message: "Failed to fetch user" }
  }
}

/**
 * Fetches all users for a specific program.
 * 
 * @param {number} programId - The ID of the program to fetch users for.
 * @returns {Promise<{ users: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getUsersByProgram(programId: number) {
  try {
    const programUsers = await db
      .select()
      .from(users)
      .where(eq(users.programId, programId))
    return { users: programUsers, error: false }
  } catch (error) {
    return { users: [], error: true, message: "Failed to fetch program users" }
  }
}

/**
 * Fetches all instructors.
 * 
 * @returns {Promise<{ users: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getAllInstructors() {
  try {
    const programUsers = await db
      .select()
      .from(users)
      .where(
        eq(users.type, 'instructor')
      )
    return { users: programUsers, error: false }
  } catch (error) {
    return { users: [], error: true, message: "Failed to fetch instructors" }
  }
}

/**
 * Fetches all students for a specific program.
 * 
 * @param {number} programId - The ID of the program to fetch users for.
 * @returns {Promise<{ users: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getStudentsByProgram(programId: number) {
  try {
    const programUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.programId, programId),
          eq(users.type, 'student')
        )
      )
    return { users: programUsers, error: false }
  } catch (error) {
    return { users: [], error: true, message: "Failed to fetch program students" }
  }
}

/**
 * Fetches all users for a specific team.
 * 
 * @param {number} teamId - The ID of the team to fetch users for.
 * @returns {Promise<{ users: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getProjectPartnerByTeamId(teamId: number) {
  try {
    const projectPartners = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.teamId, teamId),
        eq(users.type, 'project_partner')
      )
    )  
    return { projectPartners, error: false }
  } catch (error) {
    return { user: null, error: true, message: "Failed to fetch project partner" }
  }
}


/**
 * Fetches all users on the same team, excluding the project partner for the given teamId.
 * 
 * @param {number} teamId - The ID of the team.
 * @returns {Promise<{ teammates: any[], error: boolean, message?: string }> }
 */
export async function getTeamUsersExcludingPartner(teamId: number) {
  try {
    // Fetch all users in the given team
    const teamUsers = await db
      .select({
        email: users.email,
      })
      .from(users)
      .where(eq(users.teamId, teamId)) // Use teamId directly
      .execute();
      
    // Exclude the project partner (if any)
    const teammates = teamUsers.filter(user => user.type !== "project_partner");

    return {
      error: false,
      teammates
    };
  } catch (error) {
    console.error("Failed to fetch team users excluding project partner", error);
    return { error: true, message: "Failed to fetch team users", teammates: [] };
  }
}


/**
 * Fetches a user by their Clerk ID.
 * 
 * @param {string} clerkId - The Clerk ID of the user to fetch.
 * @returns {Promise<{ user: any; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerk_user_id, clerkId))
      .limit(1)
    return { user: user[0], error: false }
  } catch (error) {
    return { user: null, error: true, message: "Failed to fetch user" }
  }
}