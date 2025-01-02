import { notFound } from "next/navigation";
import { auth } from "~/server/auth";
import { getOwnedProjectById } from "~/server/queries";
import { HydrateClient } from "~/trpc/server";
import { ProjectPage } from "./_components/project-page";

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
      <ProjectPage project={project} />
    </HydrateClient>
  );
}
