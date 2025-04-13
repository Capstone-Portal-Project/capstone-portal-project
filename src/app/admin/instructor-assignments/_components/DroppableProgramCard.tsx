"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DataTableUser, columns } from "../columns";
import UserCard from "./UserCard";
import { useMemo } from "react";


type ProjectCardProps = {
    imgUrl?: string,
    title?: string, 
    description?: string,
    tags?: string[],
    projectId?: number,
    users: DataTableUser[],
}

const DroppableProgramCard = (props: ProjectCardProps) => {
    const CHAR_LIMIT = 150;
    const { imgUrl, title, description, tags, projectId: programId, users } = props;
    const { setNodeRef } = useDroppable({
        id: programId!,
        data: {
            type: "program",
            programId: programId,
        }
    })
    // const style = {
    //     transition,
    //     transform: CSS.Transform.toString(transform),
    // }

    const userIds = useMemo(() => users.map((user) => user.id), [users]);

    return (
        <div ref={setNodeRef} className="w-full">
            <Card className="min-h-[250px] flex flex-col"> {/* Changed h-[250px] to min-h-[250px] */}
                <CardHeader className="pt-3 pb-1 hover:underline">
                    <CardTitle className="text-xl font-semibold line-clamp-2">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="m-4 p-4 bg-slate-200 rounded-md flex flex-col gap-2 flex-grow">
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export default DroppableProgramCard;
