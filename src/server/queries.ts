import { and, eq } from "drizzle-orm";
import "server-only";
import { db } from "./db";
import { projects } from "./db/schema";

export async function getProjectsByOwner(
  ownerId: string,
  options: { limit?: number } = {},
) {
  const query = db.select().from(projects).where(eq(projects.ownerId, ownerId));

  if (options.limit) {
    query.limit(options.limit);
  }

  return await query.execute();
}

export async function createProject(name: string, ownerId: string) {
  return db
    .insert(projects)
    .values({
      name,
      ownerId,
    })
    .returning();
}

export async function getOwnedProjectById(projectId: string, ownerId: string) {
  return await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.ownerId, ownerId)),
  }).execute();
}

export async function getProjectById(projectId: string) {
  return await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  }).execute();
}

export async function updateProjectEnvPath(projectId: string, envPath: string) {
  return await db
    .update(projects)
    .set({
      envPath,
    })
    .where(eq(projects.id, projectId))
    .returning();
}