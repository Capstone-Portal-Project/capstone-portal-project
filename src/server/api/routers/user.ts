"use server"

import { db } from "~/server/db"
import { users } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

const userFormSchema = z.object({
 u_name: z.string().min(2).max(100),
 email: z.string().email()
})

export async function createUser(
 unsafeData: z.infer<typeof userFormSchema>
): Promise<{ error: boolean; message?: string }> {
 const { success, data } = userFormSchema.safeParse(unsafeData)

 if (!success) {
   return { error: true, message: "Invalid data" }
 }

 try {
   await db.insert(users).values({
     u_name: data.u_name,
     email: data.email,
   }).execute()

   return { error: false }
 } catch (error) {
   return { error: true, message: "Failed to create user" }
 }
}

export async function getAllUsers() {
 try {
   const allUsers = await db.select().from(users)
   return { users: allUsers, error: false }
 } catch (error) {
   return { users: [], error: true, message: "Failed to fetch users" }
 }
}

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

export async function getUserById(userId: number) {
 try {
   const user = await db
     .select()
     .from(users)
     .where(eq(users.u_id, userId))
     .limit(1)
   return { user: user[0], error: false }
 } catch (error) {
   return { user: null, error: true, message: "Failed to fetch user" }
 }
}