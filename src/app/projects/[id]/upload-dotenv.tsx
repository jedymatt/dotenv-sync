"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function UploadDotenv({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<ArrayBuffer | null>();

  async function handleUpload() {
    if (!file) return;

    const response = await fetch(
      `/api/projects/${projectId}/dotenv`,
      {
        method: "POST",
        body: file,
      },
    );

    if (response.ok) {
      toast.success("Uploaded successfully");
    } else {
      toast.error("Failed to upload");
    }

    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Input
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setFile(await file.arrayBuffer());
        }}
      />
      <Button onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
    </div>
  );
}
