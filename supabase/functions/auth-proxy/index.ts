import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type ProxyPayload = {
  action?: "signup" | "signin";
  email?: string;
  password?: string;
  redirectTo?: string;
  data?: {
    name?: string;
    mobile_number?: string;
    gender?: "man" | "woman";
    location?: string;
  };
};

const allowedOrigin = (origin: string | null) => {
  if (!origin) return "*";

  const isLovableDomain =
    origin.endsWith(".lovable.app") ||
    origin.endsWith(".lovableproject.com");

  if (isLovableDomain) return origin;

  return "*";
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin(origin),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !anonKey) {
      return new Response(
        JSON.stringify({ error: "Backend auth configuration is missing." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const payload = (await req.json()) as ProxyPayload;

    if (!payload?.action || !payload?.email || !payload?.password) {
      return new Response(
        JSON.stringify({ error: "action, email, and password are required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const endpoint = payload.action === "signup"
      ? `/auth/v1/signup${payload.redirectTo ? `?redirect_to=${encodeURIComponent(payload.redirectTo)}` : ""}`
      : "/auth/v1/token?grant_type=password";

    const upstreamBody = payload.action === "signup"
      ? {
          email: payload.email,
          password: payload.password,
          data: payload.data ?? {},
          gotrue_meta_security: {},
          code_challenge: null,
          code_challenge_method: null,
        }
      : {
          email: payload.email,
          password: payload.password,
        };

    const upstreamResponse = await fetch(`${supabaseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "x-client-info": "auth-proxy/1.0",
        "x-supabase-api-version": "2024-01-01",
      },
      body: JSON.stringify(upstreamBody),
    });

    const text = await upstreamResponse.text();

    return new Response(text, {
      status: upstreamResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unexpected auth proxy error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
