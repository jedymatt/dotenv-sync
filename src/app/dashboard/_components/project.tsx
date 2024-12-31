import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "~/server/auth";
import { createProject } from "~/server/queries";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

const CreateProjectSchema = z.object({
  name: z.string().min(1),
});

export async function CreateProjectForm() {
  const session = (await auth())!;

  return (
    <form
      action={async (formData: FormData) => {
        "use server";

        const { data } = CreateProjectSchema.safeParse(
          Object.fromEntries(formData.entries()),
        );
        if (!data) {
          return;
        }

        await createProject(data.name, session.user.id);

        revalidatePath("/dashboard");
      }}
    >
      <div className="flex items-end gap-2">
        <Label>
          Project Name:
          <Input type="text" name="name" autoFocus className="max-w-sm" />
        </Label>
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  );
}
