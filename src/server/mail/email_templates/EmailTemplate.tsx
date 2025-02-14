import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Img as Image,
  Link,
  Section,
} from "@react-email/components";
import { projectLogTypes} from "../sendMail";

interface EmailTemplateProps {
  /** Person receiving the email, displayed in the message */
  recipientName: string;
  /** Name of the project */
  projectName: string;
  /** A link to share (e.g., project link) */
  projectLink: string;
  /** Type of project log */
  projectLogType: projectLogTypes;
}

/**
 * Helper function that returns the headline and body message
 * based on the projectLogType.
 */
function getEmailContent(
  projectLogType: projectLogTypes,
  recipientName: string,
  projectName: string
) {
  switch (projectLogType) {
    case projectLogTypes.SUBMISSION:
      return {
        headline: "Project Submission",
        message: `Your project, ${projectName}, has been submitted successfully.`,
      };
    case projectLogTypes.DEFERMENT:
      return {
        headline: "Project Deferment",
        message: `Your project, ${projectName}, has been deferred.`,
      };
    case projectLogTypes.APPROVAL:
      return {
        headline: "Congrats!",
        message: `${recipientName} has approved your project, ${projectName}.`,
      };
    case projectLogTypes.PARTNER_MESSAGE:
      return {
        headline: "Partner Message",
        message: `You have received a new message regarding ${projectName} from your partner.`,
      };
    case projectLogTypes.INSTRUCTOR_ADMIN_MESSAGE:
      return {
        headline: "Instructor/Admin Message",
        message: `You have received a new message regarding ${projectName} from your instructor/admin.`,
      };
    case projectLogTypes.COURSE_TRANSFER:
      return {
        headline: "Course Transfer",
        message: `Your project, ${projectName}, is being transferred to another course.`,
      };
    default:
      return {
        headline: "Project Update",
        message: `There is an update on your project, ${projectName}.`,
      };
  }
}

export const EmailTemplate = ({
  recipientName,
  projectName,
  projectLink,
  projectLogType,
}: EmailTemplateProps) => {
  const { headline, message } = getEmailContent(
    projectLogType,
    recipientName,
    projectName
  );

  return (
    <Html>
      <Head />
      <Preview>{message}</Preview>
      <Body
        style={{
          margin: 0,
          padding: "20px",
        }}
      >
        <Container
          style={{
            borderRadius: "5px",
            padding: "20px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Section style={{ textAlign: "center" }}>
            {/* TODO: Update the image link hosted on main site */}
            <Image
              src="https://i.ibb.co/m5psC5V3/osu-drupal-480.png"    
              alt="Oregon State Banner"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            />
          </Section>

          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            {headline}
          </Text>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {message}
          </Text>

          <Section style={{ textAlign: "center", marginBottom: "20px" }}>
            <Link
              href={projectLink}
              style={{
                fontSize: "16px",
                textDecoration: "underline",
              }}
            >
              View your submitted project here
            </Link>
          </Section>

          <Section style={{ textAlign: "center" }}>
            <Link
              href="https://capstone-portal-project.vercel.app/"
              style={{
                fontSize: "16px",
                textDecoration: "underline",
              }}
            >
              Website Link
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
