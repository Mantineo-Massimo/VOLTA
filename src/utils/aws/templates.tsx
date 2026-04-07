import { sendEmail } from "@/utils/aws/ses";

export async function sendEmailChangeRequest({ to, first_name, verifyUrl }: { to: string; first_name: string; verifyUrl: string }) {
    const emailHtml = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 60px 40px; background: #000; color: #fff; border: 1px solid #222;">
            <div style="margin-bottom: 40px;">
                <span style="font-size: 10px; letter-spacing: 5px; color: #FFB800; text-transform: uppercase; font-weight: 900;">SECURITY UPDATE.</span>
            </div>
            
            <h1 style="font-size: 56px; line-height: 0.9; text-transform: uppercase; letter-spacing: -3px; margin: 0 0 40px 0; font-style: italic; font-weight: 900;">
                MODIFICA <br/>
                <span style="color: #FFB800;">EMAIL.</span>
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 40px;">
                Ciao ${first_name}, abbiamo ricevuto una richiesta di modifica per il tuo indirizzo email su VŌLTA. Clicca il tasto qui sotto per confermarlo.
            </p>
            
            <a href="${verifyUrl}" 
               style="display: inline-block; background: #FFB800; color: #000; padding: 25px 50px; text-decoration: none; font-size: 14px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase;">
                CONFERMA NUOVA EMAIL
            </a>

            <p style="margin-top: 40px; font-size: 11px; color: #444; text-transform: uppercase;">
                Se non hai richiesto questa modifica, ignora pure questa email. Il link scadrà tra 24 ore.<br/><br/>
                Se il tasto non funziona, copia questo link nel browser:<br/>
                <span style="color: #666; word-break: break-all;">${verifyUrl}</span>
            </p>

            <div style="margin-top: 80px; padding-top: 40px; border-top: 1px solid #222;">
                <p style="font-size: 9px; letter-spacing: 4px; color: #444; text-transform: uppercase; margin: 0;">VŌLTA MESSINA 2026 // NO ORDINARY NIGHTLIFE</p>
            </div>
        </div>
    `;

    return await sendEmail({
        to,
        subject: "VŌLTA | Conferma Cambio Email",
        html: emailHtml
    });
}
