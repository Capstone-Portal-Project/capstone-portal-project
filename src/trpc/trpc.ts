import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from '~/server/db';

/**
 * Create the TRPC context.
 * 
 * This function creates the context for TRPC procedures, including the database connection
 * and request options.
 * 
 * @param opts - The options for creating the context.
 * @returns The TRPC context.
 */
export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    db,
    ...opts,
  };
};

type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create();

/**
 * Create a TRPC router.
 */
export const createTRPCRouter = t.router;

/**
 * Create a public TRPC procedure.
 */
export const publicProcedure = t.procedure;