import { mailtrapClient, sender } from "../mailtrap/mailtrap.config.js";
import {VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from "../mailtrap/emailTemplates.js";

export const sendverificationEmail  = async (email, verificationToken) => {
    const recipient = [{email}]
    
    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("verificationCode", verificationToken),
            category:"Email verification"
        });

        console.log("Email sent successfuly", response);
    }catch(err){
        throw new Error(`error sending verification email: ${error}}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to:recipient,
            template_uuid: "316c2a64-87f7-4d5f-af82-8cb991ac6355",
            template_variables: {
            "company_info_name": "Test_Company_info_name",
            "name": "Test_Name"
            }
        })

        console.log("Welcome email sent successfully", response);
    }catch(err){
        throw new Error(`Error sending email ${err}`);
    }
}

export const sendPasswordResetEmail = async(email, resetUrl) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject: "Reset your password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category:"Reset password"
        })
        return response;
    }catch(err){
        throw new Error("Password reset failed")
    }
}

export const sendResetSuccessfulEmail = async (email) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password update successful!!!",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Reset Password Success"
        })
        return response;
    }catch(err){
        console.log("Error in sendResetSuccessfulEmail:", err);
        throw new Error("Send reset success email failed.");
    }
}