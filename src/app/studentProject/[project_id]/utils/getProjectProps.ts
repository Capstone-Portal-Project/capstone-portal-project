
import type { ProjectSchema } from "~/app/_components/editprojectpage";
import type { ProjectProps, InfoCard } from "./getDummyData";

/**
 * File-scoped (module-level) variables that act like 'static' storage.
 * They will reset whenever this file is reloaded or redeployed.
 */
let savedProjectTags: InfoCard["keywords"] = [];
let savedProjectPartnerNames = "N/A";
let savedProgramName = "N/A";
let savedSequence = "N/A";

const LoremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Mauris nec neque in elit auctor accumsan ut quis sem. 
Vivamus quam nunc, mattis ut tortor vel, laoreet viverra mauris. 
Suspendisse interdum arcu in leo molestie, in euismod velit sollicitudin.
`.trim();

const ShortLoremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Mauris nec neque in elit auctor accumsan ut quis sem.
`.trim();

const ShorterLoremIpsum = "Lorem Ipsum";

/**
 * `getProjectProps` returns a `ProjectProps` object.
 * When new tags or partner names are provided, it updates the
 * file-scoped variables for subsequent calls.
 */
export default function getProjectProps(
  project: ProjectSchema,
  projectTags?: InfoCard["keywords"],        // optional
  projectPartnerNames?: string,             // optional
  programName?: string,
  teammates?: string[],
  sequence?: string,
): ProjectProps {
  if (projectTags !== undefined) {
    savedProjectTags = projectTags;
    console.log("Saved new project tags:", savedProjectTags);
  }
  if (projectPartnerNames !== undefined) {
    savedProjectPartnerNames = projectPartnerNames;
    console.log("Saved new project partner names:", savedProjectPartnerNames);
  }
  if (programName !== undefined) {
    savedProgramName = programName;
    console.log("Saved new program name:", savedProgramName);
  }
  if (sequence !== undefined) {
    savedSequence = sequence;
    console.log("Saved new sequence:", savedSequence);
  }

  return {
    header: {
      title: project?.projectTitle ?? ShorterLoremIpsum,
      organization: project?.appOrganization ?? "N/A",
      program: savedProgramName,
      sequence: savedSequence,
      githubLink: project?.projectGithubLink ?? undefined,
      videoLink: project?.appVideo ?? undefined,
    },
    content: {
      textcontent: [
        {
          heading: "Description",
          text: project?.appDescription ?? LoremIpsum,
        },
        {
          heading: "Objectives",
          text: project?.appObjectives ?? LoremIpsum,
        },
        {
          heading: "Motivations",
          text: project?.appMotivations ?? LoremIpsum,
        },
        {
          heading: "Minimum Qualifications",
          text: project?.appMinQualifications ?? ShortLoremIpsum,
        },
        {
          heading: "Preferred Qualifications",
          text: project?.appPrefQualifications ?? ShortLoremIpsum,
        },
      ],
    },
    infoCard: {
      img: project?.appImage ?? "",
      desc: project?.showcaseDescription ?? "",
      details: {
        "Project Partner": savedProjectPartnerNames,
        "Teammates": teammates,
        "NDA/IPA": false,
        "Number of Groups": 0,
        "Project Status": project?.isShowcasePublished,
      },
      keywords: savedProjectTags,
    },
  };
}

