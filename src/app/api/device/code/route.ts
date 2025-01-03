import crypto from "crypto";
import { addMinutes } from "date-fns";
import { and, eq, gte } from "drizzle-orm";
import { db } from "~/server/db";
import { devices } from "~/server/db/schema";

// should be unique in the current session
async function generateUserCode(tries: number) {
  if (tries <= 0) {
    throw new Error("Failed to generate a unique user code");
  }

  const userCode = crypto.randomBytes(3).toString("hex").toUpperCase();

  const existing = await db.query.devices
    .findFirst({
      where: and(
        eq(devices.userCode, userCode),
        gte(devices.expiresAt, new Date()),
      ),
    })
    .execute();

  if (existing) return generateUserCode(tries - 1);

  return userCode;
}

export async function POST() {
  const deviceCode = crypto.randomUUID();
  const userCode = await generateUserCode(5);

  await db.insert(devices).values({
    deviceCode,
    userCode,
    expiresAt: addMinutes(new Date(), 10),
  });

  return Response.json({
    deviceCode,
    userCode,
  });
}
