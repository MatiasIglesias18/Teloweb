import { NextResponse } from "next/server";

export async function middleware(request, response) {
  const session = request.cookies.get("session");

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const checkAdminPrivilege = await fetch(
      `${request.nextUrl.origin}/api/check-privileges`,
      {
        method: "POST",
        headers: {
          Cookie: `session=${session?.value}`,
        },
        body: JSON.stringify({
          roles: ["admin"],
        }),
      }
    );
    const adminPrivilege = await checkAdminPrivilege.json();
    if (adminPrivilege.error !== false) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const checkOperadorPrivilege = await fetch(
      `${request.nextUrl.origin}/api/check-privileges`,
      {
        method: "POST",
        headers: {
          Cookie: `session=${session?.value}`,
        },
        body: JSON.stringify({
          roles: ["operador"],
        }),
      }
    );
    const operadorPrivilege = await checkOperadorPrivilege.json();
    if (operadorPrivilege.error !== false) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    if (!session) {
      return NextResponse.next();
    }
    const checkOperadorPrivilege = await fetch(
      `${request.nextUrl.origin}/api/check-privileges`,
      {
        method: "POST",
        headers: {
          Cookie: `session=${session?.value}`,
        },
        body: JSON.stringify({
          roles: ["admin", "operador"]
        }),
      }
    );
    const operadorPrivilege = await checkOperadorPrivilege.json();
    if (operadorPrivilege.error !== false) {
      return NextResponse.next();
    }
    if (operadorPrivilege.rol === "operador") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (operadorPrivilege.rol === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();

  }

}

//Add your protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
