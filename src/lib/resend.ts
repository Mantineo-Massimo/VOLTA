import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(email: string, eventName: string, date: string) {
    try {
        const data = await resend.emails.send({
            from: "VŌLTA <noreply@volta.club>",
            to: [email],
            subject: `Confirmed: ${eventName}`,
            html: `
                <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; text-transform: uppercase; border: 1px solid #FFB800;">
                    <h1 style="color: #FFB800; letter-spacing: 5px;">VŌLTA</h1>
                    <p style="letter-spacing: 2px;">Your reservation is confirmed.</p>
                    <hr style="border-color: #333;" />
                    <div style="margin: 20px 0;">
                        <p><strong>Event:</strong> ${eventName}</p>
                        <p><strong>Date:</strong> ${date}</p>
                    </div>
                </div>
            `,
        });
        return data;
    } catch (error) {
        console.error("Resend error:", error);
        throw new Error("Failed to send email");
    }
}
