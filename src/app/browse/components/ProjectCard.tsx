import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import PinButton from "./PinButton";


type ProjectCardProps = {
    imgUrl?: string,
    title?: string, 
    description?: string,
    tags?: string[],
}
  
const ProjectCard = (props: ProjectCardProps) => {
    const CHAR_LIMIT = 110;
    const { imgUrl, title, description, tags } = props;

    const clickHandler = () => {
    }

    return (
        <Card className="bg-[#f7f5f5] shadow-md">
            <CardHeader className="flex-row pt-3 pb-1 justify-end">
                <PinButton onClick={clickHandler} />
            </CardHeader>
            <CardContent className="space-y-3">
                <img src={imgUrl} className="" />
                <CardTitle className="">{ title }</CardTitle>
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
