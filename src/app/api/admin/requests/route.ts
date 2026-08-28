import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionToken,
} from "@/lib/adminSession";

function isAuthenticated(request: NextRequest) {
  return isValidAdminSessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
    process.env.ADMIN_SESSION_SECRET,
  );
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return unauthorized();

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Request storage is not configured." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("requests")
    .select("id, name, service, message, timestamp")
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Failed to fetch requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ requests: data ?? [] });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) return unauthorized();

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Request storage is not configured." },
      { status: 503 },
    );
  }

  try {
    const { id } = await request.json();

    if (typeof id !== "string" || !id.trim() || id.length > 128) {
      return NextResponse.json(
        { error: "Request id is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("requests").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete request:", error);
      return NextResponse.json(
        { error: "Failed to delete request" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}






