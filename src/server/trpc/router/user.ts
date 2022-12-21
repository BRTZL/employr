import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          addresses: true,
          projects: true,
          tasks: true,
          socials: true,
          notes: true,
        },
      });
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(0),
        rowsPerPage: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const usersCount = await ctx.prisma.user.count();
      const users = await ctx.prisma.user.findMany({
        skip: input.rowsPerPage * input.page,
        take: input.rowsPerPage,
      });

      return {
        totalCount: usersCount,
        users,
      };
    }),
});
