import { NextResponse } from "next/server";
import { createSavedProject } from "~/server/api/routers/savedProjects";


export async function POST(req: Request) {
    try {
        const { userId, projectId } = await req.json();

        if (!userId || !projectId) {
            return NextResponse.json({ error: true, message: "Missing userId or projectId" }, { status: 400 });
        }

        const result = await createSavedProject({ userId, projectId, saveIndex: 0 });

        if (result.error) {
            return NextResponse.json({ error: true, message: result.message }, { status: 500 });
        }

        return NextResponse.json({ error: false, saveId: result.saveId }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: true, message: "Internal server error" }, { status: 500 });
    }
}
