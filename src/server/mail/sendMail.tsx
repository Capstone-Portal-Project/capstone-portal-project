
import React from "react";
import { render } from "@react-email/render";
import { sendEmail } from "./mailer";
import { EmailTemplate } from "./EmailTemplate";

const recipientEmail = "phamjus@oregonstate.edu";
const name = "John Doe";

const emailHtml = await render(<EmailTemplate name={name} />, {
    pretty: true,
});

await sendEmail(recipientEmail, "Welcome!", emailHtml);
