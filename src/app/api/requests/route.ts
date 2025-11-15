import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn("Supabase credentials missing. Contact form API disabled.");
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 },
    );
  }

  try {
    const { name, service, message } = await request.json();

    if (!service || !message) {
      return NextResponse.json(
        { error: "Service and message are required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("requests").insert({
      name: name ?? null,
      service,
      message,
    });

    if (error) {
      console.error("Failed to save request:", error);
      return NextResponse.json(
        { error: "Failed to save request" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}



