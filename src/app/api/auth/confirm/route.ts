import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    let email = searchParams.get("email");
    if (email) email = email.toLowerCase();

    if (!token || !email) {
        return NextResponse.redirect(new URL("/account?error=missing_params", req.url));
    }

    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // 1. Find profile with this token and email
        const { data: profile, error: findError } = await supabase
            .from('profiles')
            .select('id, is_verified, verification_token')
            .eq('email', email)
            .eq('verification_token', token)
            .single();

        if (findError || !profile) {
            console.error("Verification error: Profile not found or token mismatch", findError);
            return NextResponse.redirect(new URL("/account?error=invalid_token", req.url));
        }

        if (profile.is_verified) {
            return NextResponse.redirect(new URL("/account?message=already_verified", req.url));
        }

        // 2. Mark as verified
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                is_verified: true,
                verification_token: null // Clear token after use
            })
            .eq('id', profile.id);

        if (updateError) throw updateError;

        // 3. Success! Redirect to account page with success message
        return NextResponse.redirect(new URL("/account?message=verified_success", req.url));

    } catch (error) {
        console.error("Confirmation API error:", error);
        return NextResponse.redirect(new URL("/account?error=server_error", req.url));
    }
}
