import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "~/server/auth";
import { createProject } from "~/server/queries";


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

        console.log(data);

        if (!data) {
          return;
        }

        await createProject(data.name, session.user.id);

        revalidatePath("/dashboard");
    }}
    >
      <label>
        Project Name:
        <input type="text" name="name" autoFocus/>
      </label>
      <button type="submit">Create Project</button>
    </form>
  );
}
