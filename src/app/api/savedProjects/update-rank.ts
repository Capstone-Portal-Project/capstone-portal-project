import { NextResponse } from 'next/server';
import { db } from "~/server/db";
import { savedProjects } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    const { saveId, saveIndex } = await request.json();

    // Ensure saveId and saveIndex are valid
    if (typeof saveId !== 'number' || typeof saveIndex !== 'number') {
      return NextResponse.json(
        { message: 'Invalid input data', success: false },
        { status: 400 }
      );
    }

    const updatedProject = await db
      .update(savedProjects)
      .set({ saveIndex })
      .where({saveId})
      .returning();

    if (updatedProject.length === 0) {
      return NextResponse.json({ message: 'Project not found', success: false }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ message: 'Rank updated successfully', success: true });
  } catch (error) {
    console.error('Error updating rank:', error);
    return NextResponse.json({ message: 'Server error', success: false }, { status: 500 });
  }
}
