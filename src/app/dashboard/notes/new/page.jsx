import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { NoteForm } from "@/components/note-form";
import { getCurrentUser } from "@/app/actions/auth";
import { getNoteById, getTags } from "@/app/actions/notes";
import { ArrowLeft } from "lucide-react";

export default async function NewNotePage(props) {
  console.log(props);
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const editId = searchParams.edit;

  let note = null;
  if (editId) {
    note = await getNoteById(editId);

    // Protect route if note does not exist or does not belong to logged-in user
    if (!note || note.userId !== user.id) {
      redirect("/dashboard");
    }
  }

  const allTags = await getTags();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neo-bg">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Back/Cancel Link */}
        <Link
          href={note ? `/dashboard/notes/${note.id}` : "/dashboard"}
          className="self-start flex items-center gap-2 font-black uppercase text-sm border-2 border-black bg-white px-3 py-1.5 shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo-md active:translate-x-[1px] active:translate-y-[1px] active:shadow-neo-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 stroke-[3]" />
          Cancel
        </Link>

        {/* Note Form Card */}
        <Card bg="bg-white" className="shadow-neo-lg border-4 border-black">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-black">
                {note ? "Edit Note" : "Create Note"}
              </h1>
              <p className="font-semibold text-zinc-600 text-sm">
                {note
                  ? "Update the title, content, or tags of your existing note."
                  : "Add a new note to your personal developer dashboard."}
              </p>
            </div>

            <NoteForm initialNote={note} allTags={allTags} />
          </div>
        </Card>
      </div>
    </div>
  );
}
