import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const AIRBNB_API_URL = "https://api.airbnb.com/v2";

async function handler(req: Request): Promise<Response> {
  const { pathname, searchParams } = new URL(req.url);

  if (pathname === "/listings") {
    const accessToken = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!accessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const response = await fetch(`${AIRBNB_API_URL}/listings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Airbnb-API-Key": process.env.AIRBNB_CLIENT_ID!,
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}

serve(handler);
