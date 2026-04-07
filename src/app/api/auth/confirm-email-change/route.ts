import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        const uid = searchParams.get("uid");

        if (!token || !uid) {
            return NextResponse.redirect(new URL("/account?error=missing_params", req.url));
        }

        // 1. Initialize Admin Client (requires SERVICE_ROLE_KEY)
        let supabaseAdmin;
        try {
            supabaseAdmin = createAdminClient();
        } catch (e) {
            console.error("Admin Client Initialization Failed:", e);
            return NextResponse.redirect(new URL("/account?error=admin_key_missing", req.url));
        }

        // 2. Fetch Profile to verify token
        const { data: profile, error: fetchError } = await supabaseAdmin
            .from('profiles')
            .select('email_change_token, new_email')
            .eq('id', uid)
            .single();

        if (fetchError || !profile || profile.email_change_token !== token) {
            return NextResponse.redirect(new URL("/account?error=invalid_token", req.url));
        }

        const newEmail = profile.new_email;

        // 3. Update Auth User Email (Silenziose, no generic Supabase emails)
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(uid, {
            email: newEmail,
            email_confirm: true
        });

        if (authError) {
            console.error("Auth Admin Update Error:", authError);
            return NextResponse.redirect(new URL("/account?error=auth_sync_failed", req.url));
        }

        // 4. Update Profile Table
        const { error: profileUpdateError } = await supabaseAdmin
            .from('profiles')
            .update({
                email: newEmail,
                new_email: null,
                email_change_token: null
            })
            .eq('id', uid);

        if (profileUpdateError) {
            console.error("Profile Final Update Error:", profileUpdateError);
            // This is non-critical if Auth succeeded, but still an error
        }

        // 5. Success Redirect
        return NextResponse.redirect(new URL("/account?mode=login&message=email_verified", req.url));

    } catch (error: any) {
        console.error("Confirm Email Change API error:", error);
        return NextResponse.redirect(new URL("/account?error=unknown_failure", req.url));
    }
}
