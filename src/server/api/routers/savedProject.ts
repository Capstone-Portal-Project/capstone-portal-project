"use server"

import { db } from "~/server/db"
import { savedProjects } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

const savedProjectSchema = z.object({
 u_id: z.number(),
 cp_id: z.number()
})

export async function createSavedProject(
 unsafeData: z.infer<typeof savedProjectSchema>
): Promise<{ error: boolean; message?: string }> {
 const { success, data } = savedProjectSchema.safeParse(unsafeData)

 if (!success) {
   return { error: true, message: "Invalid data" }
 }

 try {
   await db.insert(savedProjects).values({
     u_id: data.u_id,
     cp_id: data.cp_id,
   }).execute()

   return { error: false }
 } catch (error) {
   return { error: true, message: "Failed to save project" }
 }
}

export async function getAllSavedProjects() {
 try {
   const projects = await db.select().from(savedProjects)
   return { projects, error: false }
 } catch (error) {
   return { projects: [], error: true, message: "Failed to fetch saved projects" }
 }
}