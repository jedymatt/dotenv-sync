"use client";

import { type projects } from "~/server/db/schema";
import { DotenvContainer } from "./dotenv-container";
import { UploadDotenv } from "./upload-dotenv";

export function ProjectPage({
  project,
}: {
  project: typeof projects.$inferSelect;
}) {
  return (
    <div className="space-y-4">
      <div className="text-xl font-medium">{project.name}</div>
      <UploadDotenv projectId={project.id} />

      {project.envPath ? (
        <DotenvContainer projectId={project.id} />
      ) : (
        <div>No .env file uploaded</div>
      )}
    </div>
  );
}
