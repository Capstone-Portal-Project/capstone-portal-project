import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import UpdateRankButton from "./UpdateRankButton"; // Import the UpdateRankButton
import PinButton from "./PinButton"; // Import the PinButton
import { getTitleByProjectId } from '~/server/api/routers/project'; // Import the 
import { useEffect, useState } from "react";


const defaultImgUrl = "https://eecs.engineering.oregonstate.edu/capstone/submission/assets/img/capstone_test.jpg";

type ProjectCardProps = {
  saveId: number;
  userId: number;
  preferenceDescription: string | null;
  saveIndex: number;
  projectId: number;
  onDelete: (saveId: number) => void;  // Add this prop to handle deletion
  onMoveUp: (saveId: number) => void;  // Added onMoveUp prop
  onMoveDown: (saveId: number) => void;  // Added onMoveDown prop
};

const ProjectCard = ({ saveId, preferenceDescription, projectId, saveIndex, onDelete, onMoveUp, onMoveDown }: ProjectCardProps) => {
  const [projectTitle, setProjectTitle] = useState<string | null>(null);

  // Fetch the project title based on projectId
  useEffect(() => {
    const fetchProjectTitle = async () => {
      const result = await getTitleByProjectId(projectId);
      if (!result.error) {
        setProjectTitle(result.title);
      } else {
        setProjectTitle("Project not found");
      }
    };
    
    fetchProjectTitle();
  }, [projectId]);

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="bg-[#FFFFFF] rounded-lg ease-in-out transition-all duration-300 group hover:bg-[#f7f5f5]">
      <div className="flex space-x-4 p-3">
        <div className="h-20 w-24 rounded-2xl border-4 shrink-0 overflow-hidden">
          <Link href={`/project/${projectId}`}>
            <img src={defaultImgUrl} className="w-full h-full object-cover" alt="Project Thumbnail" />
          </Link>
        </div>
        <div className="w-full space-y-1.5 leading-none tracking-tight">
          <div className="flex justify-between">
            <div className="text-lg font-semibold">{projectTitle || "Loading..."}</div> {/* Display project title */}
            <PinButton saveId={saveId} onDelete={onDelete} /> {/* Pass the onDelete prop */}
          </div>
          <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis line-clamp-2">
            {preferenceDescription}
          </div>
          <div className="text-xs text-gray-500 mt-1">{`Save Index: ${saveIndex}`}</div>
          <div className="flex space-x-2 mt-2">
            {/* Prevent Link navigation when clicking the buttons */}
            <button onClick={(e) => { handleButtonClick(e); onMoveUp(saveId); }} className="px-2 py-1 bg-blue-500 text-white rounded">
              Up
            </button>
            <button onClick={(e) => { handleButtonClick(e); onMoveDown(saveId); }} className="px-2 py-1 bg-blue-500 text-white rounded">
              Down
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
