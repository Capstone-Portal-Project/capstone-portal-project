import { Badge } from "~/components/ui/badge";
import PinButton from "./PinButton";
import Link from "next/link";

const defaultImgUrl = "https://eecs.engineering.oregonstate.edu/capstone/submission/assets/img/capstone_test.jpg";

type ProjectCardProps = {
    imgUrl?: string,
    title?: string, 
    description?: string,
    tags?: string[],
    projectId?: number,
} 

const ProjectCard = (props: ProjectCardProps) => {
    const { imgUrl = defaultImgUrl, title, description, tags, projectId } = props;

    return (
        <Link href={`/project/${projectId}`}>
            <div className="bg-[#FFFFFF] rounded-lg ease-in-out transition-all duration:300 group hover:bg-[#f7f5f5]">
                <div className="flex space-x-4 p-3">
                    <div className="h-20 w-24 rounded-2xl border-4 shrink-0 overflow-hidden">
                        <img src={imgUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full space-y-1.5 leading-none tracking-tight">
                        <div className="flex justify-between">
                            <div className="text-lg font-semibold">{title}</div>
                        </div>
                        <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis line-clamp-2">{description}</div>
                    </div>
                </div>
                <div className="p-3 pt-0 flex flex-row gap-2 flex-wrap">
                    {tags?.map((tag, index) => <Badge className="rounded-sm" key={index}>{tag}</Badge>)}
                </div>
            </div>      
        </Link>  
    );
}

export default ProjectCard;
