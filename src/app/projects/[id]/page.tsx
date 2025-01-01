import {
  GetObjectCommand,
  type GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { notFound } from "next/navigation";
import { type BundledLanguage, codeToHtml } from "shiki";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { auth } from "~/server/auth";
import { getOwnedProjectById } from "~/server/queries";
import { storage } from "~/server/storage/client";
import { UploadDotenv } from "./upload-dotenv";

export const dynamic = "force-dynamic";

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

async function getDotEnv(envPath: string) {
  const getParams = {
    Bucket: storage.bucketName,
    Key: envPath,
  } satisfies GetObjectCommandInput;

  const url = await getSignedUrl(
    storage.client,
    new GetObjectCommand(getParams),
    { expiresIn: 3600 },
  );

  const response = await fetch(url, {
    headers: { "Content-Type": "text/plain" },
  });

  if (!response.ok) {
    return null;
  }

  const dotenvContent = await response.text();

  return dotenvContent;
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

  const envFile = project.envPath ? await getDotEnv(project.envPath) : null;

  return (
    <div className="space-y-4">
      <div className="text-xl font-medium">{project.name}</div>
      <div className="max-w-md">
        <UploadDotenv projectId={project.id} />
      </div>
      {envFile && (
          <ScrollArea className="h-screen/2">
            <CodeBlock lang="dotenv">{envFile}</CodeBlock>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
      )}
    </div>
  );
}
