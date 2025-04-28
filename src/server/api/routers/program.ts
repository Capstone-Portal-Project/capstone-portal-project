"use server"

import { db } from "~/server/db"
import { programs } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { term } from "~/server/db/schema"
import { users } from "~/server/db/schema"
import { instructors } from "~/server/db/schema"
import { createClerkOrganization, addAdminsToOrganization, deleteOrganization } from "../../auth/clerk-admin"

/**
 * Schema for validating program form data.
 */
const programFormSchema = z.object({
  programName: z.string().min(2).max(256),
  programDescription: z.string().optional(),
  programStatus: z.enum(['submissions', 'matching', 'active', 'ending', 'archived', 'hidden']),
  startTermId: z.number(),
  endTermId: z.number(),
  clerkOrganizationId: z.string().optional()
})

/**
 * Creates a new program/course and a corresponding Clerk organization.
 * 
 * @param {z.infer<typeof programFormSchema>} unsafeData - The data to create the program with.
 * @returns {Promise<{ error: boolean; message?: string; programId?: number }>} The result of the creation operation.
 */
export async function createProgram(
  unsafeData: z.infer<typeof programFormSchema> & { selected_instructors?: number[] }
): Promise<{ error: boolean; message?: string; programId?: number }> {
  const { success, data } = programFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    // Insert the program into the database
    const result = await db.insert(programs)
      .values(data)
      .returning({ programId: programs.programId })
      .execute()

    const programId = result[0]?.programId;

    if (programId) {
      // Create a Clerk organization for this program
      const orgName = `${data.programName} (${programId})`;
      const organizationId = await createClerkOrganization(orgName);
      
      if (organizationId) {
        
        // Update the program with the Clerk organization ID
        await db.update(programs)
          .set({ clerkOrganizationId: organizationId })
          .where(eq(programs.programId, programId))
          .execute();

        // Add all admin users to the new organization
        await addAdminsToOrganization(organizationId);
        
        if (unsafeData.selected_instructors && unsafeData.selected_instructors.length > 0) {
          await db.insert(instructors)
            .values(
              unsafeData.selected_instructors.map(userId => ({
                programId: programId,
                userId: userId
              }))
            )
            .execute()
        }
      }
      
      return { error: false, programId };
    }
    
    return { error: true, message: "Failed to create program" };
  } catch (error) {
    console.error("Error creating program:", error);
    return { error: true, message: "Failed to create program" };
  }
}

/**
 * Fetches all programs.
 * 
 * @returns {Promise<{ programs: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getAllPrograms() {
  try {
    const allPrograms = await db
      .select({
        programId: programs.programId,
        programName: programs.programName,
        programDescription: programs.programDescription,
        programStatus: programs.programStatus,
        startTermId: programs.startTermId,
        endTermId: programs.endTermId,
        start_term: {
          id: term.id,
          season: term.season,
          year: term.year,
          is_published: term.isPublished
        }
      })
      .from(programs)
      .leftJoin(term, eq(programs.startTermId, term.id))
      .then(async (programsWithStartTerm) => {
        const programsWithEndTerm = await Promise.all(
          programsWithStartTerm.map(async (program) => {
            const endTerm = await db
              .select()
              .from(term)
              .where(eq(term.id, program.endTermId))
              .then((terms) => terms[0]);

            const programInstructors = await db
              .select({
                user_id: users.userId,
                username: users.username,
                email: users.email,
                type: users.type
              })
              .from(instructors)
              .leftJoin(users, eq(instructors.userId, users.userId))
              .where(eq(instructors.programId, program.programId))
              .then(instructors => instructors.map(instructor => ({
                user_id: instructor.user_id ?? 0,
                username: instructor.username ?? '',
                email: instructor.email ?? '',
                type: instructor.type ?? 'instructor' as const
              })));
            
            return {
              ...program,
              start_term: program.start_term ? {
                id: program.start_term.id,
                season: program.start_term.season,
                year: program.start_term.year,
                is_published: program.start_term.is_published
              } : undefined,
              end_term: endTerm ? {
                id: endTerm.id,
                season: endTerm.season,
                year: endTerm.year,
                is_published: endTerm.isPublished
              } : undefined,
              instructors: programInstructors
            };
          })
        );
        return programsWithEndTerm;
      });
    
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


/**
 * Fetches the status of a program.
 * 
 * @param {number} programId - The ID of the program to fetch.
 * @returns {Promise<{ status: string; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getProgramStatus(
  programId: number
): Promise<{ status: string; error: boolean; message?: string }> {
  try {
    const program = await db
      .select()
      .from(programs)
      .where(eq(programs.programId, programId))
    
    if (program.length === 0) {
      return { status: "", error: true, message: "Program not found" }
    }

    if (!program[0]) {
      return { status: "", error: true, message: "Program not found" }
    }

    return { status: program[0].programStatus, error: false }
  } catch (error) {
    return { status: "", error: true, message: "Failed to fetch program status" }
  }
}


/**
 * Updates a program.
 * 
 * @param {number} programId - The ID of the program to update.
 * @param {z.infer<typeof programFormSchema>} unsafeData - The data to update the program with.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateProgram(
  programId: number,
  unsafeData: z.infer<typeof programFormSchema> & { selected_instructors?: number[] }
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = programFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    // Update program
    await db.update(programs)
      .set(data)
      .where(eq(programs.programId, programId))
      .execute()

    // Update instructor assignments
    if (unsafeData.selected_instructors !== undefined) {
      // First delete all existing instructor assignments
      await db.delete(instructors)
        .where(eq(instructors.programId, programId))
        .execute()

      // Then insert new instructor assignments if any are selected
      if (unsafeData.selected_instructors.length > 0) {
        await db.insert(instructors)
          .values(
            unsafeData.selected_instructors.map(userId => ({
              programId: programId,
              userId: userId
            }))
          )
          .execute()
      }
    }

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update program" }
  }
}

/**
 * Get a program by programId
 * 
 * @param {number} programId - The ID of the program to get.
 * @returns {Promise<{ program: any; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getProgramById(programId: number) {
  try {
    const program = await db.select()
      .from(programs)
      .where(eq(programs.programId, programId))
    return { program: program[0], error: false }
  } catch (error) {
    return { program: null, error: true, message: "Failed to fetch program" }
  }
}

/**
 * Deletes a program by its ID.
 * 
 * @param {number} programId - The ID of the program to delete.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the delete operation.
 */
export async function deleteProgram(programId: number) {
  try {
    // Get the program first to get its name for the organization
    const program = await db.select()
      .from(programs)
      .where(eq(programs.programId, programId))
      .then(programs => programs[0]);

    if (!program) {
      return { error: true, message: "Program not found" };
    }

    // Delete the program from the database
    await db.delete(programs)
      .where(eq(programs.programId, programId))
      .execute();

    // Delete the corresponding Clerk organization
    if (program.clerkOrganizationId) {
      await deleteOrganization(program.clerkOrganizationId);
    } else {
      console.error("Program has no Clerk organization ID");
    }

    return { error: false };
  } catch (error) {
    console.error("Error deleting program:", error);
    return { error: true, message: "Failed to delete program" };
  }
}

/**
 * Fetches the Clerk organization ID for a given program.
 * @param programId - The ID of the program to get the Clerk organization ID for.
 * @returns {Promise<string | null>} The Clerk organization ID if found, otherwise null.
 */
export async function getClerkOrganizationId(programId: number): Promise<string | null> {
  try {
    const program = await db.select({ clerkOrganizationId: programs.clerkOrganizationId })
      .from(programs)
      .where(eq(programs.programId, programId))
      .then(programs => programs[0]);

    return program?.clerkOrganizationId || null;
  } catch (error) {
    console.error("Error fetching Clerk organization ID:", error);
    return null;
  }
}
