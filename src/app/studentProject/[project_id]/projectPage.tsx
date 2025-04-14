"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProjectContent from "./components/projectContent";
import type { ProjectProps } from "./utils/getDummyData";
import ProjectEditSidebarPopout from "~/app/_components/editprojectpage";
import type { ProjectSchema } from "~/app/_components/editprojectpage";
import { Button } from "src/components/ui/button";
import { SquarePenIcon } from "lucide-react";
import getProjectProps from "./utils/getProjectProps";
import { EyeOffIcon } from "lucide-react";
import { Pin } from "lucide-react";
import { checkUserRole } from "~/app/utils/checkUserRole";
export interface ProjectPageClientProps {
  pageContent: ProjectProps;
  project: ProjectSchema;
  programName: string;
  sequenceName: string;
  projectPartnerNames: string;
  teammates: string[]; 
  projectTags: { tagId: number; tag: string | null; projectTagId: number; }[];
}

export default function ProjectPageClient({
  pageContent: initialProject,
  project: projectDetails,
  programName,
  sequenceName,
  projectPartnerNames,
  teammates,
  projectTags,
}: ProjectPageClientProps) {
  const [pageContent, setPageContent] = useState<ProjectProps>(initialProject);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const handleRefresh = (editData: ProjectSchema) => {
    console.log("Refreshing page...");
    setPageContent(() =>
      getProjectProps(editData, projectTags, projectPartnerNames, programName,teammates, sequenceName)
    );

    console.log(pageContent);
    router.refresh();
  };

  if (!pageContent) return <div>Loading...</div>;

  return (
    <>
      {isSidebarVisible && (
        // Sidebar overlay with fixed positioning and z-index
        <div className="fixed z-50">
          <ProjectEditSidebarPopout
            project={projectDetails}
            refreshPage={handleRefresh}
            onClose={() => setSidebarVisible(false)}
          />
        </div>
      )}

      <ProjectContent {...pageContent} />

      {/* Flex container fixed at the bottom right. 
          The use of flex-row-reverse ensures the first button stays at the right,
          and additional buttons will expand leftwards. */}
      <div className="fixed bottom-4 right-4 flex flex-row-reverse items-center space-x-2 space-x-reverse z-60">
        <Button
          onClick={() => setSidebarVisible((prev) => !prev)}
          variant="outline"
          className="border-[#DC4405]"
        >
          {isSidebarVisible ? (
            <>
              <EyeOffIcon />
              <p>Close Editor</p>
            </>
          ) : (
            <>
              <SquarePenIcon />
              <p>Edit Content</p>
            </>
          )}
        </Button>
      </div>
    </>
  );
}
