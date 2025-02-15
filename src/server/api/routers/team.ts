"use server"

import { db } from "~/server/db"
import { teams, users } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

/**
 * Schema for validating team form data.
 */
const teamFormSchema = z.object({
  projectId: z.number(),
  capacity: z.number().optional()
})

/**
 * Creates a new team.
 * 
 * @param {z.infer<typeof teamFormSchema>} unsafeData - The data to create the team with.
 * @returns {Promise<{ error: boolean; message?: string; teamId?: number }>} The result of the creation operation.
 */
export async function createTeam(
  unsafeData: z.infer<typeof teamFormSchema>
): Promise<{ error: boolean; message?: string; teamId?: number }> {
  const { success, data } = teamFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    const result = await db.insert(teams)
      .values(data)
      .returning({ teamId: teams.teamId })
      .execute()

    return { 
      error: false, 
      teamId: result[0]?.teamId 
    }
  } catch (error) {
    return { error: true, message: "Failed to create team" }
  }
}

/**
 * Updates an existing team.
 * 
 * @param {number} teamId - The ID of the team to update.
 * @param {Partial<z.infer<typeof teamFormSchema>>} unsafeData - The new data for the team.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateTeam(
  teamId: number,
  unsafeData: Partial<z.infer<typeof teamFormSchema>>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = teamFormSchema.partial().safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    await db.update(teams)
      .set(data)
      .where(eq(teams.teamId, teamId))
      .execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update team" }
  }
}

/**
 * Fetches all teams.
 * 
 * @returns {Promise<{ teams: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getAllTeams() {
  try {
    const allTeams = await db.select().from(teams)
    return { teams: allTeams, error: false }
  } catch (error) {
    return { teams: [], error: true, message: "Failed to fetch teams" }
  }
}

/**
 * Fetches a team by its ID.
 * 
 * @param {number} teamId - The ID of the team to fetch.
 * @returns {Promise<{ team: any; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getTeamById(teamId: number) {
  try {
    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.teamId, teamId))
      .limit(1)
    return { team: team[0], error: false }
  } catch (error) {
    return { team: null, error: true, message: "Failed to fetch team" }
  }
}

/**
 * Fetches all members of a specific team.
 * 
 * @param {number} teamId - The ID of the team to fetch members for.
 * @returns {Promise<{ members: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getTeamMembers(teamId: number) {
  try {
    const teamMembers = await db
      .select()
      .from(users)
      .where(eq(users.teamId, teamId))
    return { members: teamMembers, error: false }
  } catch (error) {
    return { members: [], error: true, message: "Failed to fetch team members" }
  }
}

/**
 * Adds a member to a team.
 * 
 * @param {number} teamId - The ID of the team to add the member to.
 * @param {number} userId - The ID of the user to add to the team.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the addition operation.
 */
export async function addTeamMember(
  teamId: number,
  userId: number
): Promise<{ error: boolean; message?: string }> {
  try {
    await db.update(users)
      .set({ teamId: teamId })
      .where(eq(users.userId, userId))
      .execute()
    
    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to add team member" }
  }
}

/**
 * Removes a member from a team.
 * 
 * @param {number} userId - The ID of the user to remove from the team.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the removal operation.
 */
export async function removeTeamMember(
  userId: number
): Promise<{ error: boolean; message?: string }> {
  try {
    await db.update(users)
      .set({ teamId: null })
      .where(eq(users.userId, userId))
      .execute()
    
    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to remove team member" }
  }
}

/**
 * Deletes a team.
 * 
 * @param {number} teamId - The ID of the team to delete.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the deletion operation.
 */
export async function deleteTeam(teamId: number): Promise<{ error: boolean; message?: string }> {
  try {
    // First remove team association from all users
    await db.update(users)
      .set({ teamId: null })
      .where(eq(users.teamId, teamId))
      .execute()
    
    // Then delete the team
    await db.delete(teams)
      .where(eq(teams.teamId, teamId))
      .execute()
    
    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to delete team" }
  }
}