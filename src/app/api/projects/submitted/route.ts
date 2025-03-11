import { getSubmittedProjects } from '~/server/api/routers/project';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await getSubmittedProjects();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: true, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
} 