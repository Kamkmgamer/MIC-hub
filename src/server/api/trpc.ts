import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";
import { getAuth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

interface AuthContext {
  auth: ReturnType<typeof getAuth>;
}

const createInnerTRPCContext = ({ auth }: AuthContext) => {
  return {
    db,
    auth,
  };
};

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const req = {
    headers: opts.headers,
  } as unknown as NextRequest;
  
  const auth = getAuth(req);
  return createInnerTRPCContext({ auth });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);