import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const SES_CONFIG = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
};

const sesClient = new SESClient(SES_CONFIG);

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const params = {
        Source: process.env.SES_FROM_EMAIL,
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Data: subject,
            },
            Body: {
                Html: {
                    Data: html,
                },
            },
        },
    };

    try {
        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);
        return { success: true, messageId: result.MessageId };
    } catch (error) {
        console.error("Failed to send email via SES:", error);
        return { success: false, error };
    }
}
