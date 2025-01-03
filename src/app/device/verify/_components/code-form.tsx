"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export function CodeForm() {
  const utils = api.useUtils();
  const [code, setCode] = useState("");
  const verfiyCode = api.device.verify.useMutation({
    onSuccess: async () => {
      await utils.device.invalidate();
      setCode("");
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          verfiyCode.mutate({ code });
        }}
      >
        <Label>
          Code
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={verfiyCode.isPending || verfiyCode.isSuccess}
          />
        </Label>
        <Button
          type="submit"
          disabled={verfiyCode.isPending || verfiyCode.isSuccess}
        >
          {verfiyCode.isPending ? "Verifying..." : "Verify"}
        </Button>
      </form>

      {verfiyCode.isSuccess ? (
        <p>Device verified successfully!</p>
      ) : verfiyCode.isError ? (
        <p>Failed to verify device: {verfiyCode.error.message}</p>
      ) : null}
    </div>
  );
}
