import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-sesv2";

// Align with the logic that worked in Morgana-Orum
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const senderEmail = process.env.SES_FROM_EMAIL || "associazionemorgana@gmail.com";
    const senderName = "VŌLTA";

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.error("AWS Credentials missing in .env");
        return { success: false, error: "Credentials missing" };
    }

    try {
        const sesClient = new aws.SESv2Client({
            region: process.env.AWS_REGION || "eu-central-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        const transporter = nodemailer.createTransport({
            SES: { sesClient, SendEmailCommand: aws.SendEmailCommand },
        } as any);

        const info = await transporter.sendMail({
            from: `"${senderName}" <${senderEmail}>`,
            to,
            subject,
            html,
        });

        console.log(`✅ Email inviata con successo a ${to}. ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("SES v2 Error:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
