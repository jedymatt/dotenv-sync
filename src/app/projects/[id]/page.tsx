import { notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { getOwnedProjectById } from "~/server/queries";
import { HydrateClient } from "~/trpc/server";
import { DotenvContainer } from "./_components/dotenv-container";
import { UploadDotenv } from "./_components/upload-dotenv";

export const dynamic = "force-dynamic";

export default async function Project(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  const project = await getOwnedProjectById(params.id, session!.user.id);

  if (!project) {
    notFound();
  }

  return (
    <HydrateClient>
      <div className="space-y-4">
        <div className="text-xl font-medium">{project.name}</div>
        <UploadDotenv projectId={project.id} />

        {project.envPath ? (
          <DotenvContainer projectId={project.id} />
        ) : (
          <div>No .env file uploaded</div>
        )}
      </div>
    </HydrateClient>
  );
}
