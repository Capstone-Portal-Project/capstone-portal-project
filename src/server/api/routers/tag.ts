"use server"

import { db } from "~/server/db"
import { tags, projectTags } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

/**
 * Schema for validating tag form data.
 */
const tagFormSchema = z.object({
  tag: z.string().max(256)
})

/**
 * Schema for validating project tag form data.
 */
const projectTagFormSchema = z.object({
  capstone: z.number(),
  tagId: z.number()
})

/**
 * Creates a new tag.
 * 
 * @param {z.infer<typeof tagFormSchema>} unsafeData - The data to create the tag with.
 * @returns {Promise<{ error: boolean; message?: string; tagId?: number }>} The result of the creation operation.
 */
export async function createTag(
  unsafeData: z.infer<typeof tagFormSchema>
): Promise<{ error: boolean; message?: string; tagId?: number }> {
  const { success, data } = tagFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    const result = await db.insert(tags)
      .values(data)
      .returning({ tagId: tags.tagId })
      .execute()

    return { 
      error: false, 
      tagId: result[0]?.tagId 
    }
  } catch (error) {
    return { error: true, message: "Failed to create tag" }
  }
}

/**
 * Adds a tag to a project.
 * 
 * @param {z.infer<typeof projectTagFormSchema>} unsafeData - The data to add the project tag with.
 * @returns {Promise<{ error: boolean; message?: string; projectTagId?: number }>} The result of the addition operation.
 */
export async function addProjectTag(
  unsafeData: z.infer<typeof projectTagFormSchema>
): Promise<{ error: boolean; message?: string; projectTagId?: number }> {
  const { success, data } = projectTagFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    const result = await db.insert(projectTags)
      .values(data)
      .returning({ projectTagId: projectTags.projectTagId })
      .execute()

    return { 
      error: false, 
      projectTagId: result[0]?.projectTagId 
    }
  } catch (error) {
    return { error: true, message: "Failed to add project tag" }
  }
}

/**
 * Fetches all tags.
 * 
 * @returns {Promise<{ tags: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getAllTags() {
  try {
    const allTags = await db.select().from(tags)
    return { tags: allTags, error: false }
  } catch (error) {
    return { tags: [], error: true, message: "Failed to fetch tags" }
  }
}

/**
 * Fetches all tags for a specific project.
 * 
 * @param {number} projectId - The ID of the project to fetch tags for.
 * @returns {Promise<{ tags: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getProjectTags(projectId: number) {
  try {
    const tagResults = await db
      .select({
        tagId: tags.tagId,
        tag: tags.tag,
        projectTagId: projectTags.projectTagId
      })
      .from(tags)
      .innerJoin(
        projectTags,
        eq(tags.tagId, projectTags.tagId)
      )
      .where(eq(projectTags.capstone, projectId))
    
    return { tags: tagResults, error: false }
  } catch (error) {
    return { tags: [], error: true, message: "Failed to fetch project tags" }
  }
}

/**
 * Removes a tag from a project.
 * 
 * @param {number} projectTagId - The ID of the project tag to remove.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the removal operation.
 */
export async function removeProjectTag(projectTagId: number) {
  try {
    await db.delete(projectTags)
      .where(eq(projectTags.projectTagId, projectTagId))
      .execute()
    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to remove project tag" }
  }
}

/**
 * Deletes a tag.
 * 
 * @param {number} tagId - The ID of the tag to delete.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the deletion operation.
 */
export async function deleteTag(tagId: number) {
  try {
    // First remove all project associations
    await db.delete(projectTags)
      .where(eq(projectTags.tagId, tagId))
      .execute()
    
    // Then delete the tag
    await db.delete(tags)
      .where(eq(tags.tagId, tagId))
      .execute()
    
    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to delete tag" }
  }
}