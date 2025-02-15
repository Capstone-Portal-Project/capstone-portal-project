import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { ViewDetails } from "~/app/_components/viewdetails"

type ProjectCardProps = {
    project: {
        projectId: number;
        projectTitle: string;
        appDescription: string | null;
        appImage?: string;
        cp_date_created: Date;
        cp_archived: boolean;
    };
    onSave?: (projectId: number) => void;
}

export function ProjectCard({ project, onSave }: ProjectCardProps) {
    return (
        <Card className="w-full max-w-2xl transition-shadow hover:shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">{project.projectTitle}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {project.appImage && (
                    <div className="mb-4">
                        <img 
                            src={project.appImage} 
                            alt={project.projectTitle} 
                            className="w-full rounded-lg object-cover h-48"
                        />
                    </div>
                )}
                <p className="text-muted-foreground">
                    {project.appDescription || "No description available"}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <ViewDetails project={project} />
                {onSave && !project.cp_archived && (
                    <Button
                        variant="secondary"
                        onClick={() => onSave(project.projectId)}
                    >
                        Save Project
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}