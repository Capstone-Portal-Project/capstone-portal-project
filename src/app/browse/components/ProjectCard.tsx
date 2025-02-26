import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import PinButton from "./PinButton";
import Link from "next/link";

type ProjectCardProps = {
    imgUrl?: string,
    title?: string, 
    description?: string,
    tags?: string[],
    projectId?: number,
}

const ProjectCard = (props: ProjectCardProps) => {
    const CHAR_LIMIT = 150;
    const { imgUrl, title, description, tags, projectId } = props;

    return (
        <Link href={`/project/${projectId}`}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardHeader className="flex-row pt-3 pb-1 justify-between items-start">
                    <CardTitle className="text-xl font-semibold line-clamp-2">
                        {title}
                    </CardTitle>
                    <PinButton onClick={() => {
                        // Handle pin logic here where a user will indicate saved projects
                    }} />
                </CardHeader>
                <CardContent className="space-y-4">
                    {imgUrl && (
                        <div className="aspect-video w-full overflow-hidden rounded-md">
                            <img 
                                src={imgUrl} 
                                alt={title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <CardDescription className="text-sm line-clamp-3">
                        {description}
                    </CardDescription>
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Badge 
                                    key={index} 
                                    variant="secondary" 
                                    className="text-xs"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}

export default ProjectCard;
