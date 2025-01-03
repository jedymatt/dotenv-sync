import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { devices } from "~/server/db/schema";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceCode = url.searchParams.get("device_code");

  console.log("device_code", deviceCode, !deviceCode);
  console.log(url);

  if (!deviceCode) {
    throw new Error("Missing device_code");
  }

  const device = await db.query.devices.findFirst({
    where: eq(devices.deviceCode, deviceCode),
  });

  if (!device) {
    throw new Error("Device not found");
  }

  return Response.json({
    authorized:
      device.authorizedAt &&
      device.accessExpiresAt &&
      device.accessExpiresAt > new Date(),
  });
}
