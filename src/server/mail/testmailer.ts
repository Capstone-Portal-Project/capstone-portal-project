
import { sendLogEmail, projectLogTypes } from './sendMail';

// Constants for email details
const recipientEmail = "phamjus@oregonstate.edu";
const recipientName = "Justin Pham";
const projectName = "Email System";
const projectLink = "https://capstone-portal-project.vercel.app/";

// Function to send emails for all log types
export async function sendAllLogEmails() {
  for (const logType of Object.values(projectLogTypes).filter((value): value is projectLogTypes => typeof value !== 'string')) {
        await sendLogEmail(
            logType,
            recipientEmail,
            recipientName,
            projectName,
            projectLink
        );
  }

  console.log("All emails sent successfully!");
}

// Run the script
sendAllLogEmails().catch((error) => console.error("Error sending emails:", error));
