"use client";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Eye, EyeClosed, Loader } from "lucide-react";
import { Fragment, useLayoutEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { type BundledLanguage, codeToHast } from "shiki/bundle/full";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { type projects } from "~/server/db/schema";
import "~/styles/shiki.css";
import { api } from "~/trpc/react";
import { UploadDotenv } from "./upload-dotenv";

async function highlight(code: string, lang: BundledLanguage) {
  const out = await codeToHast(code, {
    lang,
    theme: "one-dark-pro",
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
  }) as React.JSX.Element;
}

function CodeBlock({ code }: { code: string }) {
  const [nodes, setNodes] = useState<JSX.Element>();

  useLayoutEffect(() => {
    void highlight(code, "dotenv").then(setNodes);
  }, [code]);

  return nodes;
}

export function DotenvBlock({ data }: { data: string }) {
  return (
    <ScrollArea className="h-[526px] w-full rounded-lg">
      <CodeBlock code={data ?? ""} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function ProjectPage({
  project,
}: {
  project: typeof projects.$inferSelect;
}) {
  const [showEnv, setShowEnv] = useState(false);
  const { data, isLoading, isFetched, isError, refetch } =
    api.project.getDotenv.useQuery(
      { projectId: project.id },
      {
        enabled: showEnv,
      },
    );

  return (
    <div className="space-y-4">
      <div className="text-xl font-medium">{project.name}</div>
      <UploadDotenv
        projectId={project.id}
        onSuccessfulUpload={async () => {
          await refetch();
        }}
      />

      {!project.envPath && (
        <div className="text-muted">No .env file uploaded</div>
      )}

      {project.envPath && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowEnv((prev) => !prev)}
            disabled={isLoading}
          >
            {showEnv ? "Hide" : "Show"} .env
            {showEnv ? <Eye /> : <EyeClosed />}
          </Button>

          {isLoading && (
            <div className="flex items-center space-x-2 text-sm">
              <Loader className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
        </div>
      )}

      {project.envPath && (isLoading || !showEnv) && <DotenvBlock data={""} />}

      {showEnv && isFetched && data && <DotenvBlock data={data} />}
      {showEnv && isFetched && !data && (
        <div className="text-muted">No .env file found</div>
      )}
      {showEnv && isError && (
        <div className="text-muted">Failed to load .env file</div>
      )}
    </div>
  );
}
