import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY env vars",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("user-settings")
      .select("*")
      .eq("clerk_id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? null });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;

    // Never trust client for identity; always use Clerk userId.
    const payload = {
      clerk_id: userId,
      first_name: body.first_name ?? null,
      last_name: body.last_name ?? null,
      country: body.country ?? "US",
      state_region: body.state_region ?? null,
      zip_code: body.zip_code ?? null,
      city: body.city ?? null,
      address_line1: body.address_line1 ?? null,
      address_line2: body.address_line2 ?? null,
      email: body.email ?? null,
      phone_number: body.phone_number ?? null,
      card_number: body.card_number ?? null,
      card_name: body.card_name ?? null,
      card_exp_month: body.card_exp_month ?? null,
      card_exp_year: body.card_exp_year ?? null,
      card_security_code: body.card_security_code ?? null,
      brand_name: body.brand_name ?? null,
      brand_link: body.brand_link ?? null,
      updated_at: new Date().toISOString(),
    };

    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from("user-settings")
      .upsert(payload, { onConflict: "clerk_id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 },
    );
  }
}

