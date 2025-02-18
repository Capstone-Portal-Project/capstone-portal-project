import { getProjectById } from "~/server/api/routers/project";
import { getTeamsByProjectId } from "~/server/api/routers/team";
import { getProjectPartnerByTeamId } from "~/server/api/routers/user";
import { getProjectTags } from "~/server/api/routers/tag";

const getProjectProps = async (projectId : number) => {
    
  const { project } = await getProjectById(projectId);
  const teamsResponse = await getTeamsByProjectId(projectId);
  const teams = teamsResponse.team;

  const projectPartners = teams && !teamsResponse.error ? await Promise.all(
    teams.map(async (team) => {
      const partner = await getProjectPartnerByTeamId(team.teamId);
      return partner;
    })
  ) : [];

  const projectTags = await getProjectTags(projectId);

  const projectPartnerNames = projectPartners
  .map((partner) => 'username' in partner ? partner.username : '')
  .join(", ");

    
  const LoremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec neque in elit auctor accumsan ut quis sem. Vivamus quam nunc, mattis ut tortor vel, laoreet viverra mauris. Suspendisse interdum arcu in leo molestie, in euismod velit sollicitudin. Proin felis lacus, aliquet eu tincidunt in, ornare eu elit. Quisque interdum, ipsum eu bibendum ullamcorper, diam dolor lobortis enim, nec feugiat risus lacus sit amet nunc. Donec ut lacus ut nunc convallis vestibulum sodales at sem. Vivamus mattis nibh nec sapien pellentesque lacinia. Mauris luctus sem dolor, nec porttitor magna ullamcorper vehicula. Vivamus quis vehicula urna. Duis lacus tortor, euismod eu felis non, blandit eleifend urna. Morbi accumsan dignissim risus, aliquet euismod massa dignissim pellentesque. Fusce venenatis purus quis metus malesuada, non porttitor nisi bibendum. Vivamus varius ullamcorper ex sit amet venenatis. Vivamus dapibus tempus orci, id congue eros.";
  const ShortLoremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec neque in elit auctor accumsan ut quis sem."
  const ShorterLoremIpsum = "Lorem Ipsum";

  const props = {
      hero: {
        title: project?.projectTitle ?? ShorterLoremIpsum,
        desc: project?.appDescription ?? LoremIpsum,
      },
      content: { 
        textcontent:[
          {
            heading: "Objectives",
            text:
            project?.appObjectives ?? LoremIpsum,
          },
          {
            heading: "Motivations",

            text:
              project?.appMotivations ?? LoremIpsum,
          },
          {
            heading: "Minimum Qualifications",
            text: project?.appMinQualifications ?? ShortLoremIpsum,
          },
          {
            heading: "Preferred Qualifications",
            text: project?.appPrefQualifications ?? ShortLoremIpsum,
          },
        ]
      },
      infoCard: {
        img: project?.appImage ?? '',
        desc: project?.showcaseDescription ?? '',
        details: {
          'Project Partner': projectPartnerNames ?? 'Mr. Miyagi' ,
          'NDA/IPA': false,
          'Number of Groups': teams ? teams.length : 0,
          'Project Status': project?.isShowcasePublished,          
        },
        keywords: projectTags.tags ?? [],
      },
    };

    return props;
}

export default getProjectProps;

  