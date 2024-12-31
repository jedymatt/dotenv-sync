
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {

    // const projectId = (await params).id;

    // const blob = await request.blob()

    // const buffer = Buffer.from(await blob.arrayBuffer())

    // const uploadResponse = await put(`projects/${projectId}/dotenv`, buffer, {
    //     access: 'public',
    //     contentType: 'text/plain',
    // });

    // await updateProjectEnvPath(projectId, uploadResponse.url)

    return new Response(null, { status: 200 });
}