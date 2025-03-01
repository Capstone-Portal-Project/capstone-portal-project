import type { ProjectSchema } from "~/app/_components/editprojectpage";
import type { ProjectProps, InfoCard } from "./getDummyData";

/**
 * File-scoped (module-level) variables that act like 'static' storage.
 * They will reset whenever this file is reloaded or redeployed.
 */
let savedProjectTags: InfoCard["keywords"] = [];
let savedProjectPartnerNames = "Mr. Miyagi";

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
  projectPartnerNames?: string              // optional
): ProjectProps {
  // Update file-scoped variables if new values are passed in.
  if (projectTags !== undefined) {
    savedProjectTags = projectTags;
  }
  if (projectPartnerNames !== undefined) {
    savedProjectPartnerNames = projectPartnerNames;
  }

  // Construct the final object matching ProjectProps
  return {
    hero: {
      title: project?.projectTitle ?? ShorterLoremIpsum,
      desc: project?.appDescription ?? LoremIpsum,
    },
    content: {
      textcontent: [
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
        "NDA/IPA": false,
        "Number of Groups": 0, // or another dynamic value if you have it
        "Project Status": project?.isShowcasePublished,
      },
      keywords: savedProjectTags,
    },
  };
}
