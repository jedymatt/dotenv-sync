"use client";

import "~/styles/shiki.css";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Loader } from "lucide-react";
import React, { Fragment, useLayoutEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { type BundledLanguage, codeToHast } from "shiki/bundle/full";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

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

function CodeBlock({ initial, code }: { initial?: JSX.Element; code: string }) {
  const [nodes, setNodes] = useState(initial);

  useLayoutEffect(() => {
    void highlight(code, "dotenv").then(setNodes);
  }, [code]);

  return nodes ?? <p>Loading...</p>;
}

export function DotenvSection({ projectId }: { projectId: string }) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (show && !loading && !content) {
    setLoading(true);

    fetch(`/api/projects/${projectId}/dotenv`)
      .then(async (res) => {
        if (res.ok) {
          setContent(await res.text());
        } else {
          toast.error("Failed to fetch .env file");
        }
      })
      .catch(() => {
        toast.error("Failed to fetch .env file");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {
          <Button
            variant="outline"
            onClick={() => setShow(true)}
            disabled={loading || show}
          >
            {show ? "Loaded" : "Load DotEnv"}
          </Button>
        }
        {loading && (
          <div className="flex items-center space-x-2">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>
      <ScrollArea className="h-[526px] w-full rounded-lg">
        <CodeBlock code={show && !loading ? (content ?? "") : ""} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
