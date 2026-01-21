import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 基本の公開ルート
const basePublicRoutes = [
  "/",
  "/lp",
  "/about",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
];

// 開発環境では/dashboardも公開ルートに含める
const publicRoutes = process.env.NODE_ENV === 'production' 
  ? basePublicRoutes 
  : [...basePublicRoutes, "/dashboard(.*)"];

const isPublicRoute = createRouteMatcher(publicRoutes);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // 本番環境では、/dashboard配下はログイン必須
  if (process.env.NODE_ENV === 'production' && isDashboardRoute(request)) {
    await auth.protect();
  }
  // その他の非公開ルートも保護
  else if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
