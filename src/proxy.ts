import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/comment(.*)"]);
const isSignInRouter = createRouteMatcher(["/sign-in(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    if (isApiRoute(request)) return;
    
    if (!isPublicRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/sign-in");
    }
    if (isSignInRouter(request) && (await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/");
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 365 } }
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
