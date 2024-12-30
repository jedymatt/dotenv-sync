import 'server-only';
import { db } from './db';
import { projects } from './db/schema';
import { eq } from 'drizzle-orm';


export async function getProjectsByOwner(ownerId: string, options: { limit?: number } = {}) {
    const query = db
        .select()
        .from(projects)
        .where(eq(projects.ownerId, ownerId))

    if (options.limit) {
        query.limit(options.limit)
    }

    return await query.execute();
}

export async function createProject(name: string, ownerId: string) {
    return await db.insert(projects).values({
        name,
        ownerId,
    }).returning();
}