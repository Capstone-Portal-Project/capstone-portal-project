"use server"

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Creates a new Clerk organization for a program.
 * 
 * @param {string} name - The name of the organization.
 * @returns {Promise<string|null>} The ID of the created organization, or null if creation failed.
 */
export async function createClerkOrganization(name: string): Promise<string | null> {
  try {
    // In a real implementation, we would create a Clerk organization
    // Example:
    // const organization = await clerkClient.organizations.createOrganization({
    //   name: name,
    // });
    // return organization.id;
    
    // For demonstration purposes, we'll return a mock ID
    console.log(`[MOCK] Created organization: ${name}`);
    return `org_${Math.random().toString(36).substring(2, 11)}`;
  } catch (error) {
    console.error("Error creating Clerk organization:", error);
    return null;
  }
}

/**
 * Adds all admin users to a Clerk organization.
 * 
 * @param {string} organizationId - The ID of the organization.
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function addAdminsToOrganization(organizationId: string): Promise<boolean> {
  try {
    // Fetch all admin users from the database
    const adminUsers = await db
      .select({ clerk_user_id: users.clerk_user_id })
      .from(users)
      .where(eq(users.type, "admin"));

    // In a real implementation, we would add each admin to the organization
    // Example:
    // for (const admin of adminUsers) {
    //   await clerkClient.organizations.createOrganizationMembership({
    //     organizationId,
    //     userId: admin.clerk_user_id,
    //     role: "org:admin"
    //   });
    // }
    
    // For demonstration purposes, we'll just log
    console.log(`[MOCK] Added ${adminUsers.length} admins to organization: ${organizationId}`);
    adminUsers.forEach(admin => {
      console.log(`[MOCK] - Added user ${admin.clerk_user_id} as admin`);
    });
    
    return true;
  } catch (error) {
    console.error("Error adding admins to organization:", error);
    return false;
  }
}

/**
 * Adds a user to a Clerk organization with a specific role.
 * 
 * @param {string} organizationId - The ID of the organization.
 * @param {string} clerkUserId - The ID of the user.
 * @param {string} role - The role to assign (e.g., "org:admin", "org:instructor", "org:student").
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function addUserToOrganization(
  organizationId: string,
  clerkUserId: string,
  role: string
): Promise<boolean> {
  try {
    // In a real implementation, we would add the user to the organization
    // Example:
    // await clerkClient.organizations.createOrganizationMembership({
    //   organizationId,
    //   userId: clerkUserId,
    //   role
    // });
    
    // For demonstration purposes, we'll just log
    console.log(`[MOCK] Added user ${clerkUserId} to organization ${organizationId} with role ${role}`);
    
    return true;
  } catch (error) {
    console.error("Error adding user to organization:", error);
    return false;
  }
}

/**
 * Changes a user's role in a Clerk organization.
 * 
 * @param {string} organizationId - The ID of the organization.
 * @param {string} clerkUserId - The ID of the user.
 * @param {string} role - The new role to assign.
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function changeUserRoleInOrganization(
  organizationId: string,
  clerkUserId: string,
  role: string
): Promise<boolean> {
  try {
    // In a real implementation, we would update the user's role
    // Example:
    // await clerkClient.organizations.updateOrganizationMembership({
    //   organizationId,
    //   userId: clerkUserId,
    //   role
    // });
    
    // For demonstration purposes, we'll just log
    console.log(`[MOCK] Changed user ${clerkUserId}'s role in organization ${organizationId} to ${role}`);
    
    return true;
  } catch (error) {
    console.error("Error changing user role in organization:", error);
    return false;
  }
}

/**
 * Removes a user from a Clerk organization.
 * 
 * @param {string} organizationId - The ID of the organization.
 * @param {string} clerkUserId - The ID of the user.
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function removeUserFromOrganization(
  organizationId: string,
  clerkUserId: string
): Promise<boolean> {
  try {
    // In a real implementation, we would remove the user from the organization
    // Example:
    // await clerkClient.organizations.deleteOrganizationMembership({
    //   organizationId,
    //   userId: clerkUserId
    // });
    
    // For demonstration purposes, we'll just log
    console.log(`[MOCK] Removed user ${clerkUserId} from organization ${organizationId}`);
    
    return true;
  } catch (error) {
    console.error("Error removing user from organization:", error);
    return false;
  }
} 