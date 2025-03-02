import ProjectPageClient from "./projectPage";
import getProjectProps from "./utils/getProjectProps";
import type { ProjectSchema } from "~/app/_components/editprojectpage";
import { getProjectById } from "~/server/api/routers/project";
import { getTeamsByProjectId } from "~/server/api/routers/team";
import { getProjectPartnerByTeamId } from "~/server/api/routers/user";
import { getProjectTags } from "~/server/api/routers/tag";
import { getSequenceById } from "~/server/api/routers/sequence";
import { getProgramById } from "~/server/api/routers/program";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{project_id: string}> }) {

  const projectId = (await params).project_id;
  const projectResponse = await getProjectById(Number(projectId));
  const teamsResponse = await getTeamsByProjectId(Number(projectId));
  const teams = teamsResponse.team;

  const projectPartners = teams && !teamsResponse.error ? await Promise.all(
      teams.map(async (team) => {
        const partner = await getProjectPartnerByTeamId(team.teamId);
        return partner;
      })
    ) : [];

  const projectTags = await getProjectTags(Number(projectId));

  const projectPartnerNames = projectPartners
  .map((partner) => 'username' in partner ? partner.username : '')
  .join(", ");

  if (projectResponse?.project) {
    const projectDetails : ProjectSchema = {
      projectId: Number(projectId),
      programsId: projectResponse.project.programsId,
      projectTitle: projectResponse.project.projectTitle,
      appImage: projectResponse.project.appImage ?? undefined,
      appVideo: projectResponse.project.appVideo ?? undefined,
      appOrganization: projectResponse.project.appOrganization,
      appDescription: projectResponse.project.appDescription,
      appObjectives: projectResponse.project.appObjectives,
      appMotivations: projectResponse.project.appMotivations,
      appMinQualifications: projectResponse.project.appMinQualifications,
      appPrefQualifications: projectResponse.project.appPrefQualifications,
      showcaseDescription: projectResponse.project.showcaseDescription ?? undefined,
      showcaseImage: projectResponse.project.showcaseImage ?? undefined,
      showcaseVideo: projectResponse.project.showcaseVideo ?? undefined,
      isShowcasePublished: projectResponse.project.isShowcasePublished ?? undefined,
      sequenceId: projectResponse.project.sequenceId ?? undefined,
      sequenceReport: projectResponse.project.sequenceReport ?? undefined,
      projectGithubLink: projectResponse.project.projectGithubLink ?? undefined
    }

    const programResponse = await getProgramById(projectDetails.programsId);
    const programName = programResponse.program?.programName ?? "Unknown Program";

    let sequenceName: string;

    if (projectDetails.sequenceId !== undefined) {
      const sequenceResponse = await getSequenceById(projectDetails.sequenceId);
      sequenceName = sequenceResponse.sequence?.type ?? "Unknown Sequence";
    } else {
      sequenceName = "";
    }

    const pageContent = getProjectProps(
      projectDetails,
      projectTags.tags,
      projectPartnerNames,
      programName,
      sequenceName
    );

    return <ProjectPageClient 
      pageContent={pageContent} 
      project={projectDetails}
      programName={programName}
      sequenceName={sequenceName}
      projectPartnerNames={projectPartnerNames}
      projectTags={projectTags.tags}
    />;
  }

  if (!projectResponse?.project) {
    return <div>Project not found</div>;
  }


}
