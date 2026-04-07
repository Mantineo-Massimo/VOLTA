import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sendEmailChangeRequest } from "@/utils/aws/templates";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { newEmail } = await req.json();
        if (!newEmail) {
            return NextResponse.json({ error: "Nuova email obbligatoria" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // 1. Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: "Sessione non valida" }, { status: 401 });
        }

        // 2. Generate Change Token
        const changeToken = crypto.randomBytes(32).toString("hex");

        // 3. Update profile with pending email change
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                new_email: newEmail.toLowerCase(),
                email_change_token: changeToken,
            })
            .eq('id', user.id);

        if (profileError) {
            console.error("Profile update error:", profileError);
            return NextResponse.json({ error: "Errore database durante la richiesta" }, { status: 500 });
        }

        // 4. Send Branded Email via AWS SES
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const verifyUrl = `${siteUrl}/api/auth/confirm-email-change?token=${changeToken}&uid=${user.id}`;

        // Get first name for personalized email
        const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', user.id).single();

        const emailResult = await sendEmailChangeRequest({
            to: newEmail,
            first_name: profile?.first_name || "Membro VŌLTA",
            verifyUrl
        });

        if (!emailResult.success) {
            throw new Error(`Errore invio email SES: ${emailResult.error}`);
        }

        return NextResponse.json({
            success: true,
            message: "EMAIL DI CONFERMA INVIATA AL NUOVO INDIRIZZO"
        });

    } catch (error: any) {
        console.error("Update Email API error:", error);
        return NextResponse.json({ error: error.message || "Chiamata fallita" }, { status: 500 });
    }
}
