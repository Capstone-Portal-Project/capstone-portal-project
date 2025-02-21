import ProjectPageClient from "./projectPage";
import getProjectProps from "./utils/getProjectProps";
import type { ProjectSchema } from "~/app/_components/editprojectpage";
import { getProjectById } from "~/server/api/routers/project";

export default async function ProjectPage({ params }: { params: Promise<{project_id: string}> }) {

  const projectId = (await params).project_id;
  const pageContent = await getProjectProps(Number(projectId));
  const projectResponse = await getProjectById(Number(projectId));

  if (projectResponse?.project) {
    const projectDetails : ProjectSchema = {
      projectId: Number(projectId),
      programsId: projectResponse.project.programsId,
      projectTitle: projectResponse.project.projectTitle,
      appImage: projectResponse.project.appImage,
      appVideo: projectResponse.project.appVideo,
      appOrganization: projectResponse.project.appOrganization,
      appDescription: projectResponse.project.appDescription,
      appObjectives: projectResponse.project.appObjectives,
      appMotivations: projectResponse.project.appMotivations,
      appMinQualifications: projectResponse.project.appMinQualifications,
      appPrefQualifications: projectResponse.project.appPrefQualifications,
      showcaseDescription: projectResponse.project.showcaseDescription,
      showcaseImage: projectResponse.project.showcaseImage,
      showcaseVideo: projectResponse.project.showcaseVideo,
      isShowcasePublished: projectResponse.project.isShowcasePublished,
      sequenceId: projectResponse.project.sequenceId,
      sequenceReport: projectResponse.project.sequenceReport,
      projectGithubLink: projectResponse.project.projectGithubLink
    }

    return <ProjectPageClient 
      pageContent={pageContent} 
      project={projectDetails}
    />;
  }

  if (!projectResponse?.project) {
    return <div>Project not found</div>;
  }


}
