import ProjectPageClient from "./projectPage";
import getProjectProps from "./utils/getProjectProps";
import type { ProjectSchema } from "~/app/_components/editprojectpage";
import { getProjectById } from "~/server/api/routers/project";
import { getTeamsByProjectId } from "~/server/api/routers/team";
import { getProjectPartnerByTeamId } from "~/server/api/routers/user";
import { getProjectTags } from "~/server/api/routers/tag";
import { getSequenceById } from "~/server/api/routers/sequence";
import { getProgramById } from "~/server/api/routers/program";
import { getTeamUsersExcludingPartner } from "~/server/api/routers/user"; // Adjusted to use userId

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ project_id: string }> }) {
  const projectId = (await params).project_id;
  const projectResponse = await getProjectById(Number(projectId));
  const teamsResponse = await getTeamsByProjectId(Number(projectId));
  const teams = teamsResponse.team;

  type ProjectPartner = {
    userId: number;
    username: string;
    email: string;
    dateCreated: Date;
    type: string;
  };

  const projectPartners = teams && !teamsResponse.error
    ? await Promise.all(
        teams.map(async (team) => {
          const partnerResponse = await getProjectPartnerByTeamId(team.teamId);
          if (!partnerResponse.error && partnerResponse.projectPartners?.length) {
            return partnerResponse.projectPartners[0]; // assuming only one partner per team
          }
          return null;
        })
      )
    : [];

  const filteredPartners = projectPartners;

  const projectPartnerNames = filteredPartners
    .map((partner) => partner.username)
    .join(", ");

  const projectTags = await getProjectTags(Number(projectId));

  const teammateEmails: string[] = teams && !teamsResponse.error
  ? (
      await Promise.all(
        teams.map(async (team) => {
          const { teammates } = await getTeamUsersExcludingPartner(team.teamId);
          return teammates.map((t) => t.email); // directly map to email strings
        })
      )
    ).flat()
  : [];

  if (projectResponse?.project) {
    const projectDetails: ProjectSchema = {
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
    };

    const programResponse = await getProgramById(projectDetails.programsId);
    const programName = programResponse.program?.programName ?? "Unknown Program";

    let sequenceName = "";
    if (projectDetails.sequenceId !== undefined) {
      const sequenceResponse = await getSequenceById(projectDetails.sequenceId);
      sequenceName = sequenceResponse.sequence?.type ?? "Unknown Sequence";
    }

    const pageContent = getProjectProps(
      projectDetails,
      projectTags.tags,
      projectPartnerNames,
      programName,
      teammateEmails,
      sequenceName
    );

    return (
      <ProjectPageClient
        pageContent={pageContent}
        project={projectDetails}
        programName={programName}
        sequenceName={sequenceName}
        projectPartnerNames={projectPartnerNames}
        teammates={teammateEmails}
        projectTags={projectTags.tags}
      />
    );
  }

  return <div>Project not found</div>;
}
