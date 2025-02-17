import { Pin } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";


type ProjectCardProps = {
    imgUrl?: string,
    title?: string, 
    description?: string,
    tags?: string[],
}
  
const ProjectCard = (props: ProjectCardProps) => {
    const CHAR_LIMIT = 110;
    const { imgUrl, title, description, tags } = props;

    return (
        <Card className="bg-[#f7f5f5]">
        <CardHeader className="flex-row pt-3 pb-1 justify-end">
            <Button className="bg-[#f7f5f5] text-[#423e3c] hover:bg-[#e9e5e4] h-8 w-8 [&_svg]:size-5">
            <Pin />
            </Button>
        </CardHeader>
        <CardContent className="space-y-3">
            <img src={imgUrl} />
            <CardTitle>{ title }</CardTitle>
            <CardDescription className="text-sm">{
            description?.slice(0, description.indexOf(' ', CHAR_LIMIT)) + '...' 
            }</CardDescription>
            <div className="flex flex-row gap-2 flex-wrap">
            {tags?.map((tag, index) => <Badge className="rounded-sm" key={index}>{tag}</Badge>)}
            </div>
        </CardContent>
        </Card>
    );
}

export default ProjectCard;
