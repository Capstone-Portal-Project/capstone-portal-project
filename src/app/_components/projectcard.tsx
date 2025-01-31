import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import Link from "next/link"

type ProjectCardProps = {
    project: {
        cp_id: number;
        cp_title: string;
        cp_description: string | null;
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
                    <CardTitle className="text-xl font-bold">{project.cp_title}</CardTitle>
                </div>
                <CardDescription>
                    Created on {new Date(project.cp_date_created).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    {project.cp_description || "No description available"}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Link href={`/project/${project.cp_id}`}>
                    <Button variant="outline">View Details</Button>
                </Link>
                {onSave && !project.cp_archived && (
                    <Button
                        variant="secondary"
                        onClick={() => onSave(project.cp_id)}
                    >
                        Save Project
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}