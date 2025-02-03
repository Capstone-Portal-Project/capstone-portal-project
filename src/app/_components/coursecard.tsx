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

type CourseCardProps = {
    course: {
        course_id: number;
        u_id: string;
        name: string;
        term: string;
        course_description: string | null;
    };
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/browse/${course.course_id}`}>
            <Card className="w-full max-w-2xl transition-shadow hover:shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold">{course.name}</CardTitle>
                    </div>
                    <div className="flex items-center justify-between">
                        <Badge>{course.term}</Badge>
                    </div>
                    {course.course_description && (
                        <CardDescription>{course.course_description}</CardDescription>
                    )}
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">View Projects</Button>
                </CardFooter>
            </Card>
        </Link>
    )
}