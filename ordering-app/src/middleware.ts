import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isProfilePage = req.nextUrl.pathname.startsWith("/profile");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isCheckoutPage = req.nextUrl.pathname.startsWith("/checkout");
    const isOrdersPage = req.nextUrl.pathname.startsWith("/orders");

    const role = req.nextauth.token?.role;

    if (isAdminPage && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Only require auth for specific paths
        const paths = ["/profile", "/admin", "/checkout", "/orders"];
        const path = req.nextUrl.pathname;
        const requiresAuth = paths.some((p) => path.startsWith(p));

        if (requiresAuth) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/checkout/:path*", "/orders/:path*"],
};
