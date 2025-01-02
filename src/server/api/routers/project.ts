import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { storage } from "~/server/storage/client";
import { createTRPCRouter, protectedProjectProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  getDotenv: protectedProjectProcedure.query(async ({ ctx }) => {
    const project = ctx.project;

    if (!project.envPath) {
      throw new Error("No .env file uploaded");
    }

    const url = await getSignedUrl(
      storage.client,
      new GetObjectCommand({
        Bucket: storage.bucketName,
        Key: `projects/${project.id}/.env`,
      }),
      { expiresIn: 3600 },
    );

    const response = await fetch(url);

    return await response.text();
  }),
});
