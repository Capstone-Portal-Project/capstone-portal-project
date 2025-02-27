import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";

type ProjectCardProps = {
    imgUrl?: string,
    title?: string, 
    description?: string,
    tags?: string[],
    projectId?: number,
}

const DroppableProjectCard = (props: ProjectCardProps) => {
    const CHAR_LIMIT = 150;
    const { imgUrl, title, description, tags, projectId } = props;

    return (
        <Link href={`/project/${projectId}`}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardHeader className="flex-row pt-3 pb-1 justify-between items-start hover:underline">
                    <CardTitle className="text-xl font-semibold line-clamp-2">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-16 m-4 bg-slate-200 rounded-md">
                    


                </CardContent>
            </Card>
        </Link>
    );
}

export default DroppableProjectCard;
