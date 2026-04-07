import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sendEmail } from "@/utils/aws/ses";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        let { email, password, full_name } = await req.json();
        email = email.toLowerCase();

        if (!email || !password || !full_name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // 1. Generate Verification Token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // 2. Signup user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                }
            }
        });

        if (authError) throw authError;

        if (authData.user) {
            // 3. Create profile with is_verified = false
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        full_name,
                        email,
                        role: 'user',
                        verification_token: verificationToken,
                        is_verified: false
                    }
                ]);

            if (profileError) {
                console.error("Profile creation error:", profileError);
                throw new Error("Errore nella creazione del profilo. Hai eseguito il comando SQL?");
            }

            // 4. Send Verification Email via AWS SES Directly
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const verifyUrl = `${siteUrl}/api/auth/confirm?token=${verificationToken}&email=${email}`;

            const emailHtml = `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 60px 40px; background: #000; color: #fff; border: 1px solid #222;">
                    <div style="margin-bottom: 40px;">
                        <span style="font-size: 10px; letter-spacing: 5px; color: #FFD700; text-transform: uppercase; font-weight: 900;">SECURITY PROTOCOL.</span>
                    </div>
                    
                    <h1 style="font-size: 56px; line-height: 0.9; text-transform: uppercase; letter-spacing: -3px; margin: 0 0 40px 0; font-style: italic; font-weight: 900;">
                        VERIFICA <br/>
                        <span style="color: #FFD700;">PROFILO.</span>
                    </h1>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 40px;">
                        Ciao ${full_name}, per accedere al portale VŌLTA devi prima attivare la tua membership cliccando il tasto qui sotto.
                    </p>
                    
                    <a href="${verifyUrl}" 
                       style="display: inline-block; background: #FFD700; color: #000; padding: 25px 50px; text-decoration: none; font-size: 14px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase;">
                        ATTIVA MEMBERSHIP
                    </a>

                    <p style="margin-top: 40px; font-size: 11px; color: #444; text-transform: uppercase;">
                        Se il tasto non funziona, copia questo link nel browser:<br/>
                        <span style="color: #666; word-break: break-all;">${verifyUrl}</span>
                    </p>

                    <div style="margin-top: 80px; padding-top: 40px; border-top: 1px solid #222;">
                        <p style="font-size: 9px; letter-spacing: 4px; color: #444; text-transform: uppercase; margin: 0;">VŌLTA MESSINA 2026 // NO ORDINARY NIGHTLIFE</p>
                    </div>
                </div>
            `;

            const emailResult = await sendEmail({
                to: email,
                subject: "VŌLTA | Attivazione Account",
                html: emailHtml
            });

            if (!emailResult.success) {
                console.error("SES send error:", emailResult.error);
                throw new Error(`Errore invio email: ${emailResult.error}`);
            }
        }

        return NextResponse.json({ success: true, user: authData.user }, { status: 201 });

    } catch (error: any) {
        console.error("Signup API error:", error);
        return NextResponse.json({ error: error.message || "Failed to signup" }, { status: 500 });
    }
}
