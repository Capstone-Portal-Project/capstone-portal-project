import { NextResponse } from 'next/server';

let mockProjects = [
  { saveId: 1, studentId: 1, projectId: 101, saveIndex: 1 },
  { saveId: 2, studentId: 2, projectId: 102, saveIndex: 2 },
  { saveId: 3, studentId: 3, projectId: 103, saveIndex: 3 },
];

export async function POST(req: Request) {
  try {
    const { saveId, saveIndex } = await req.json();

    // Update the rank in the mock data
    mockProjects = mockProjects.map((project) =>
      project.saveId === saveId ? { ...project, saveIndex } : project
    );

    return NextResponse.json({ success: true, projects: mockProjects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update rank" }, { status: 500 });
  }
}

