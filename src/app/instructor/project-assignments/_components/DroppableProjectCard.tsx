import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DataTableUser, columns } from "../columns";
import UserCard from "./UserCard";


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
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: projectId!.toString(),
        data: {
            type: "project",
            projectId,
        }
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    return (
        <div ref={setNodeRef} style={style} className="h-[250px] max-h-[250px]">
            <Card className="h-full flex flex-col">
                <CardHeader {...attributes} {...listeners} className="pt-3 pb-1 hover:underline">
                    <CardTitle className="text-xl font-semibold line-clamp-2">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="m-4 bg-slate-200 rounded-md flex-grow">
                    {/* map the user data into a column here */}
                    <div className="m-2 flex flex-col gap-2">
                        {users.map((user) => (
                            <UserCard key={user.id} user={user} />
                            
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default DroppableProjectCard;
