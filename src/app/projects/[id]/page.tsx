import { notFound } from "next/navigation";
import { type BundledLanguage, codeToHtml } from "shiki";
import { auth } from "~/server/auth";
import { getOwnedProjectById } from "~/server/queries";
import { getEnvFileContents } from "~/server/storage";
import { UploadDotenv } from "./upload-dotenv";

interface Props {
  children: string;
  lang: BundledLanguage;
}

async function CodeBlock(props: Props) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: "github-dark",
  });

  return <div dangerouslySetInnerHTML={{ __html: out }} />;
}


export default async function Project(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  const project = await getOwnedProjectById(params.id, session!.user.id);

  if (!project) {
    notFound();
  }

  console.log(project.envPath);

  const envFile = project.envPath
    ? await getEnvFileContents(project.envPath)
    : null;

  return (
    <div>
      Project Page
      <div>{project.name}</div>
      <div className="max-w-md">
        <UploadDotenv projectId={project.id} />
      </div>
      {envFile && (
        <div className="p-6">
          <CodeBlock lang="dotenv">{envFile}</CodeBlock>
        </div>
      )}
    </div>
  );
}
