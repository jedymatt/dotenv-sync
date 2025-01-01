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
      <div className="space-y-4">
        <h1>Dashboard</h1>
        <p>Welcome back, {session.user.name}!</p>

        <CreateProjectForm />

        <p>You have {projects.length} projects:</p>
        <ul className="">
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
