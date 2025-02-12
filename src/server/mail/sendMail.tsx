
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

export async function sendLogEmail(logType: projectLogTypes, recipientEmail: string, cc: Array<string>, recipientName: string, projectName: string, projectLink: string) {

    switch (logType) {
        case projectLogTypes.SUBMISSION:
            await sendEmail(recipientEmail, cc, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.SUBMISSION}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.DEFERMENT:
            await sendEmail(recipientEmail, cc, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.DEFERMENT}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.APPROVAL:
            await sendEmail(recipientEmail, cc, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.APPROVAL}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.PARTNER_MESSAGE:
            await sendEmail(recipientEmail, cc, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.PARTNER_MESSAGE}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.INSTRUCTOR_ADMIN_MESSAGE:
            await sendEmail(recipientEmail, cc, await 
                render(<EmailTemplate
                    projectLogType={projectLogTypes.INSTRUCTOR_ADMIN_MESSAGE}
                    recipientName={recipientName} 
                    projectName={projectName}
                    projectLink={projectLink}
                />));
            break;
        case projectLogTypes.COURSE_TRANSFER:
            await sendEmail(recipientEmail, cc, await 
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
