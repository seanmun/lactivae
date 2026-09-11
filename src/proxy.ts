import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { XRAY_ROLES, devBypassSession, signInPath, type Role } from "@/lib/auth-shared";

/**
 * Request gate for the Rx Web console (Next 16 `proxy`, formerly middleware).
 *
 * - Refreshes the Supabase session cookie on matched routes.
 * - /admin/* and /api/admin/* require a session whose profile role is in XRAY_ROLES.
 *
 * The matcher is deliberately narrow so public pages stay fully static and
 * never pay for a session lookup. X-ray on public pages authenticates
 * client-side through the same auth facade.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (devBypassSession()) return NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return protectedPath
      ? NextResponse.redirect(new URL(signInPath(pathname, "unconfigured"), request.url))
      : NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() validates the JWT with Supabase and refreshes it if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!protectedPath) return response;

  if (!user) {
    return NextResponse.redirect(new URL(signInPath(pathname), request.url));
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = (profile?.role as Role | undefined) ?? "consumer";
  if (!XRAY_ROLES.includes(role)) {
    return NextResponse.redirect(new URL(signInPath(pathname, "forbidden"), request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/auth/:path*"],
};
