import "~/styles/shiki.css";

import { notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { getOwnedProjectById } from "~/server/queries";
import { DotenvSection } from "./_components/dotenv-section";
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
    <div className="space-y-4">
      <div className="text-xl font-medium">{project.name}</div>
      <div className="max-w-md">
        <UploadDotenv projectId={project.id} />
      </div>

      {project.envPath ? (
        <DotenvSection projectId={project.id} />
      ) : (
        <p>No .env file uploaded</p>
      )}
    </div>
  );
}
