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

const DroppableProjectCard = (props: ProjectCardProps) => {
    const CHAR_LIMIT = 150;
    const { imgUrl, title, description, tags, projectId, users } = props;
    const { setNodeRef } = useDroppable({
        id: projectId!,
        data: {
            type: "project",
            projectId,
        }
    })
    // const style = {
    //     transition,
    //     transform: CSS.Transform.toString(transform),
    // }

    const userIds = useMemo(() => users.map((user) => user.id), [users]);

    return (
        <div ref={setNodeRef} className="h-[250px] max-h-[250px]">
            <Card className="h-full flex flex-col">
                <CardHeader  className="pt-3 pb-1 hover:underline">
                    <CardTitle className="text-xl font-semibold line-clamp-2">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="m-4 bg-slate-200 rounded-md flex-grow">
                    <div className="m-2 flex flex-col gap-2">
                        {/* <SortableContext items={userIds}> */}
                            {users.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        {/* </SortableContext> */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default DroppableProjectCard;
