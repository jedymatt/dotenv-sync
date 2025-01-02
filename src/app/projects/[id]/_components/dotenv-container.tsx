"use client";

import "./shiki.css";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Eye, EyeClosed, Loader } from "lucide-react";
import { Fragment, useLayoutEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { type BundledLanguage, codeToHast } from "shiki/bundle/full";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";

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

export function DotenvBlock({ data }: { data?: string }) {
  return (
    <ScrollArea className="h-[526px] w-full rounded-lg">
      <CodeBlock code={data ?? ""} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function DotenvContainer({ projectId }: { projectId: string }) {
  const [showEnv, setShowEnv] = useState(false);
  const { data, isLoading, isSuccess, isError } =
    api.project.getDotenv.useQuery({ projectId }, { enabled: showEnv });

  return (
    <div className="space-y-4">
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

      {isError && <div>Failed to load .env file</div>}
      {isSuccess && !data && <div>No .env file found</div>}
      <DotenvBlock data={showEnv ? data : ""} />
    </div>
  );
}
