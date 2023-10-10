import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({publicRoutes: ["/api/cron/sendReminder"]});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};