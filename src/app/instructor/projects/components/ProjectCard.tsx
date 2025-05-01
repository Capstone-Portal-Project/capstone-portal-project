import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@clerk/clerk-react";
import { getUserByClerkId } from '~/server/api/routers/user';
import { updateProject,getProjectById } from '~/server/api/routers/project';
import { getActivePrograms } from '~/server/api/routers/program';
import { useToast } from "~/components/ui/toaster";

const defaultImgUrl = "https://eecs.engineering.oregonstate.edu/capstone/submission/assets/img/capstone_test.jpg";

type Program = {
  programId: number;
  programName: string;
};

type ProjectCardProps = {
  imgUrl?: string;
  title?: string; 
  description?: string;
  tags?: string[];
  projectId?: number;
  programId?: number;
};

const ProjectCard = (props: ProjectCardProps) => {
  const { imgUrl = defaultImgUrl, title, description, tags, projectId, programId } = props;
  const [userId, setUserId] = useState<number | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | undefined>(programId);

  const { userId: clerkUserId, isSignedIn } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserId = async () => {
      if (isSignedIn && clerkUserId) {
        try {
          const { user: fetchedUser, error } = await getUserByClerkId(clerkUserId);
          if (error) {
            console.error("Failed to fetch user by Clerk ID:", error);
            return;
          }
          setUserId(fetchedUser?.userId ?? null);
        } catch (error) {
          console.error("Error fetching userId:", error);
        }
      }
    };

    const fetchPrograms = async () => {
      const { programs, error } = await getActivePrograms();
      if (!error) {
        setPrograms(programs);
      } else {
        console.error("Failed to load programs");
      }
    };

    fetchUserId();
    fetchPrograms();
  }, [isSignedIn, clerkUserId]);

  const handleProgramChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProgramId = Number(e.target.value);
    setSelectedProgramId(newProgramId);
  
    if (!projectId) return;
  
    try {
      // Fetch the current project data using getProjectById
      const { project, error } = await getProjectById(projectId);
  
      if (error || !project) {
        toast({ title: "Error", description: "Failed to fetch project data." });
        return;
      }
  
      // Update only the programsId field, keeping other fields intact
      const dataToUpdate = {
        ...project,
        programsId: newProgramId,
        showcaseDescription: project.showcaseDescription ?? "", 
        showcaseImage: project.showcaseImage ?? "",
        showcaseVideo: project.showcaseVideo ?? "", 
        sequenceId: project.sequenceId ?? null, 
        sequenceReport: project.sequenceReport ?? "",
        projectGithubLink: project.projectGithubLink ?? "",
      };
     
      const result = await updateProject(projectId, dataToUpdate);
  
      if (!result.error) {
        toast({ title: "Success", description: "Program updated!" });
      } else {
        toast({ title: "Error wib", description: result.message || "Failed to update program." });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({ title: "Error", description: "An error occurred while updating the program." });
    }
  };
  
  

  return (
    <div className="bg-[#FFFFFF] rounded-lg ease-in-out transition-all duration:300 group hover:bg-[#f7f5f5]">
      <Link href={`/project/${projectId}`}>
        <div className="flex space-x-4 p-3">
          <div className="h-20 w-24 rounded-2xl border-4 shrink-0 overflow-hidden">
            <img src={imgUrl && imgUrl !== "" ? imgUrl : defaultImgUrl} className="w-full h-full object-cover" />
          </div>
          <div className="w-full space-y-1.5 leading-none tracking-tight">
            <div className="flex justify-between">
              <div className="text-lg font-semibold">{title}</div>
            </div>
            <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis line-clamp-2">{description}</div>
          </div>
        </div>
      </Link>

      <div className="p-3 pt-0 flex flex-col gap-2">
        {/* Tags */}
        <div className="flex flex-row gap-2 flex-wrap">
          {tags?.map((tag, index) => (
            <Badge className="rounded-sm" key={index}>{tag}</Badge>
          ))}
        </div>

        {/* Dropdown to change program */}
        <select
          value={selectedProgramId}
          onChange={handleProgramChange}
          className="mt-2 border rounded p-1"
        >
          <option value="">Change Program</option>
          {programs.map((program) => (
            <option key={program.programId} value={program.programId}>
              {program.programName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectCard;
