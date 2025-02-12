
import React from "react";
import { render } from "@react-email/render";
import { sendEmail } from "./mailer";
import { EmailTemplate } from "./email_templates/EmailTemplate";

export enum projectLogTypes {
    SUBMISSION,
    DEFERMENT,
    APPROVAL,
    PARTNER_MESSAGE,
    INSTRUCTOR_ADMIN_MESSAGE,
    COURSE_TRANSFER
}

export async function sendLogEmail(logType: projectLogTypes, recipientEmail: string, recipientName: string, projectName: string, projectLink: string, cc?: Array<string>,) {

    let subject = "";

    if (!cc) {
        cc = [""];
    }

    switch (logType) {
        case projectLogTypes.SUBMISSION:
            subject = `Project Submission: ${projectName} Successfully Submitted`
            await sendEmail(recipientEmail, cc, subject, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.SUBMISSION}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.DEFERMENT:
            subject = `Project Deferment: ${projectName} Has Been Deferred`;
            await sendEmail(recipientEmail, cc, subject, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.DEFERMENT}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.APPROVAL:
            subject = `Congratulations! ${projectName} Has Been Approved`;
            await sendEmail(recipientEmail, cc, subject, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.APPROVAL}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.PARTNER_MESSAGE:
            subject = `New Partner Message Regarding ${projectName}`;
            await sendEmail(recipientEmail, cc, subject, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.PARTNER_MESSAGE}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.INSTRUCTOR_ADMIN_MESSAGE:
            subject = `Instructor/Admin Message About ${projectName}`;
            await sendEmail(recipientEmail, cc, subject, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.INSTRUCTOR_ADMIN_MESSAGE}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.COURSE_TRANSFER:
            subject = `Project ${projectName} Transferred to Another Course`;
            await sendEmail(recipientEmail, cc, subject, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.COURSE_TRANSFER}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
    }

    return;
}
