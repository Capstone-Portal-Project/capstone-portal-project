import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/trpc/trpc";

/**
 * Handler for TRPC API requests.
 * 
 * This handler uses the `fetchRequestHandler` from `@trpc/server/adapters/fetch`
 * to process incoming requests and route them to the appropriate TRPC procedures
 * defined in the `appRouter`.
 * 
 * @param req - The incoming request object.
 * @returns A response object.
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
  });

/**
 * Export the handler for GET, POST, PUT, and DELETE requests.
 * 
 * This allows the TRPC API to handle these requests using the same handler function.
 */
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };