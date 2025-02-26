import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    projects: [
      { saveId: 1, studentId: 1, projectId: 101, saveIndex: 1, preferenceDescription: "Top pick" },
      { saveId: 2, studentId: 2, projectId: 102, saveIndex: 2, preferenceDescription: "Interesting topic" },
      { saveId: 3, studentId: 3, projectId: 103, saveIndex: 3, preferenceDescription: "Backup option" },
    ],
    error: false,
  });
}