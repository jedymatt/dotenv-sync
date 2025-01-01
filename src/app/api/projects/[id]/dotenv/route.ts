import { GetObjectCommand, PutObjectCommand, type PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "~/server/auth";
import { getOwnedProjectById, updateProjectEnvPath } from "~/server/queries";
import { storage } from "~/server/storage/client";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const projectId = (await params).id;

    if (!session) {
        return new Response(null, { status: 401 });
    }

    const project = await getOwnedProjectById(projectId, session.user.id);

    if (!project) {
        return new Response(null, { status: 404 });
    }

    const blob = await request.blob();

    const envPath = `projects/${(await params).id}/.env`;

    const putParams = {
        Bucket: storage.bucketName,
        Key: envPath,
    } satisfies PutObjectCommandInput;

    const url = await getSignedUrl(storage.client, new PutObjectCommand(putParams), { expiresIn: 3600 });

    const response = await fetch(url, {
        method: 'PUT', body: await blob.text(),
    });

    if (!response.ok) {
        return new Response(null, { status: 500 });
    }

    await updateProjectEnvPath((await params).id, envPath);

    return new Response(null, { status: 200 });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id;
    const session = await auth();

    if (!session) {
        return new Response(null, { status: 401 });
    }

    const project = await getOwnedProjectById(projectId, session.user.id);

    if (!project) {
        return new Response(null, { status: 404 });
    }

    const url = await getSignedUrl(storage.client, new GetObjectCommand({
        Bucket: storage.bucketName,
        Key: `projects/${projectId}/.env`,
    }), { expiresIn: 3600 });

    const response = await fetch(url);

    const dotenvContent = await response.text();


    return new Response(dotenvContent, { status: 200, headers: { 'Content-Type': 'text/plain' } });

}
