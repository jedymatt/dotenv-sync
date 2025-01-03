import { addMonths } from "date-fns";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import { devices } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const deviceRouter = createTRPCRouter({
  verify: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const device = await ctx.db.query.devices.findFirst({
        where: and(eq(devices.userCode, input.code)),
      });

      if (!device || device.expiresAt <= new Date()) {
        throw new Error("Invalid or expired code");
      }

      if (device.authorizedAt) {
        throw new Error("Device already verified");
      }

      await db
        .update(devices)
        .set({
          userId: ctx.session.user.id,
          authorizedAt: new Date(),
          accessExpiresAt: addMonths(new Date(), 1),
        })
        .where(eq(devices.deviceCode, device.deviceCode))
        .execute();

      return {
        deviceCode: device.deviceCode,
      };
    }),
});
