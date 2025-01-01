"use client";

import "~/styles/shiki.css";

import { ScrollArea } from "~/components/ui/scroll-area";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import React, { Fragment, useLayoutEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { type BundledLanguage, codeToHast } from "shiki/bundle/full";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ScrollBar } from "~/components/ui/scroll-area";

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
  const [content, setContent] = useState("");

  if (show) {
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
      });
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"} DotEnv
      </Button>

      {show && !content && <p>Loading...</p>}

      {show && content && (
        <ScrollArea className="h-[526px] w-full rounded-lg">
          <CodeBlock code={content} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
}
