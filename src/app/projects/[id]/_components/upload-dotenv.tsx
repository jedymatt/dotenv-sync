"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export function UploadDotenv({
  projectId,
}: {
  projectId: string;
  onSuccessfulUpload?: () => Promise<void>;
}) {
  const utils = api.useUtils();
  const [file, setFile] = useState<ArrayBuffer | null>();
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    if (loading) return;

    setLoading(true);
    const response = await fetch(`/api/projects/${projectId}/dotenv`, {
      method: "POST",
      body: file,
    });

    if (response.ok) {
      toast.success("Uploaded successfully");
    } else {
      toast.error("Failed to upload");
    }

    setLoading(false);
    setFile(null);

    if (response.ok) {
      await utils.project.getDotenv.invalidate({ projectId });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          setFile(await file.arrayBuffer());
        }}
        className="max-w-xs"
      />
      <Button
        variant="outline"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        Upload
      </Button>

      {loading && (
        <div className="flex items-center space-x-2 text-sm">
          <Loader className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
