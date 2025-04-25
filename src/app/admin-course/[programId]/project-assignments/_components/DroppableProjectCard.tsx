"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { DataTableUser, columns } from "../columns";
import UserCard from "./UserCard";
import { useMemo } from "react";
import React from "react";

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

    const userIds = useMemo(() => users.map((user) => user.id), [users]);


    return (
      <div ref={setNodeRef} className="w-full">
        <Card className="min-h-[320px] flex flex-col"> {/* Changed h-[250px] to min-h-[250px] */}
          <CardHeader className="pt-3 pb-1 hover:underline">
            <CardTitle className="text-sm font-semibold line-clamp-2">
                {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="mx-2 p-1 mb-3 bg-slate-200 rounded-sm flex flex-col gap-2 flex-grow">
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
          </CardContent>
        </Card>            
      </div>
    );
}

export default DroppableProjectCard;
