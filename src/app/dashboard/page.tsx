import { auth } from "~/server/auth";
import { getProjectsByOwner } from "~/server/queries";
import AppLayout from "../_components/app-layout";
import { CreateProjectForm } from "./_components/project";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const projects = await getProjectsByOwner(session.user.id);

  return (
    <AppLayout>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back, {session.user.name}!</p>
        <p>You have {projects.length} projects</p>

        <CreateProjectForm />

        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Button variant="link" asChild>
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
