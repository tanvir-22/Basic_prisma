import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import { getNotes, getTags } from "@/app/actions/notes";
import { SearchBar } from "@/components/search-bar";
import { DeleteButton } from "@/components/delete-button";
import {
  LogOut,
  Plus,
  Calendar,
  Hash,
  FileX,
  Database,
  User as UserIcon,
  FileText,
  ArrowRight,
  Pencil,
} from "lucide-react";

export default async function DashboardPage(props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const search = searchParams.search;

  const tag = searchParams.tag;
  console.log("i am the searchParams:",searchParams,tag);
  // Fetch Tags and Notes from Server Actions
  const tags = await getTags();
  const notes = await getNotes({ search, tag });
  const allUserNotes = await getNotes(); // Used for total count and tag counts

  // Pre-calculate note counts for tags in parent scope to avoid inline awaits in loops
  const tagCounts = {};
  for (const t of tags || []) {
    tagCounts[t?.name] = (allUserNotes || []).filter((n) =>
      (n?.tags || []).some(
        (nt) => nt?.name?.toLowerCase() === t?.name?.toLowerCase(),
      ),
    ).length;
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen">
      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-80 border-b-4 md:border-b-0 md:border-r-4 border-black bg-white p-6 flex flex-col justify-between gap-8">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight select-none cursor-pointer"
          >
            <Database className="h-6 w-6 text-black stroke-[3]" />
            LWS{" "}
            <span className="bg-neo-yellow px-2 border-2 border-black inline-block rotate-[-2deg]">
              NOTEBOOK
            </span>
          </Link>

          {/* User Section */}
          <div className="border-4 border-black bg-neo-cyan p-4 shadow-neo-sm flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
              <UserIcon className="h-4 w-4" />
              <span>User Identity</span>
            </div>
            <div className="font-black truncate">{user.name}</div>
            <div className="text-xs font-bold truncate opacity-85">
              {user.email}
            </div>
          </div>

          {/* Action: Create Note */}
          <Link href="/dashboard/notes/new">
            <Button
              variant="green"
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5 stroke-[3]" />
              New Note
            </Button>
          </Link>

          {/* Tags Filter List */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              Filter By Tag
            </div>
            <div className="flex flex-col gap-2">
              {/* All Notes Link */}
              <Link
                href="/dashboard"
                className={`flex items-center justify-between p-2.5 border-2 border-black font-bold text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                  !tag ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>All Notes</span>
                </div>
                <span className="bg-zinc-200 text-black px-1.5 py-0.5 border border-black text-xs font-black">
                  {allUserNotes?.length || 0}
                </span>
              </Link>

              {/* Tag Links */}
              {tags.map((t) => {
                const isActive = tag === t.name;
                const tagColorClass =
                  t.color === "neo-yellow"
                    ? "hover:bg-neo-yellow"
                    : t.color === "neo-pink"
                      ? "hover:bg-neo-pink"
                      : t.color === "neo-green"
                        ? "hover:bg-neo-green"
                        : t.color === "neo-cyan"
                          ? "hover:bg-neo-cyan"
                          : "hover:bg-neo-orange hover:text-white";

                return (
                  <Link
                    key={t.id}
                    href={
                      isActive
                        ? "/dashboard"
                        : `/dashboard?tag=${t.name}${search ? `&search=${search}` : ""}`
                    }
                    className={`flex items-center justify-between p-2.5 border-2 border-black font-bold text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                      isActive
                        ? t.color === "neo-yellow"
                          ? "bg-neo-yellow text-black"
                          : t.color === "neo-pink"
                            ? "bg-neo-pink text-black"
                            : t.color === "neo-green"
                              ? "bg-neo-green text-black"
                              : t.color === "neo-cyan"
                                ? "bg-neo-cyan text-black"
                                : "bg-neo-orange text-white"
                        : `bg-white text-black ${tagColorClass}`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5" />
                      <span>{t.name}</span>
                    </div>
                    <span className="bg-zinc-100 text-black px-1.5 py-0.5 border border-black text-xs font-black">
                      {tagCounts[t.name] || 0}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Logout */}
        <form action={logoutUser} className="mt-auto">
          <Button
            type="submit"
            variant="black"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 bg-neo-bg">
        {/* TOP BAR / SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
          <SearchBar defaultValue={search || ""} />
        </div>

        {/* ACTIVE FILTERS CHIPS */}
        {(search || tag) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-black uppercase text-zinc-500">
              Active Filters:
            </span>
            {search && (
              <Badge variant="neo-yellow" className="flex items-center gap-1.5">
                Search: "{search}"
                <Link
                  href={`/dashboard${tag ? `?tag=${tag}` : ""}`}
                  className="font-bold hover:text-red-500 ml-1 cursor-pointer"
                >
                  ×
                </Link>
              </Badge>
            )}
            {tag && (
              <Badge variant="neo-pink" className="flex items-center gap-1.5">
                Tag: #{tag}
                <Link
                  href={`/dashboard${search ? `?search=${search}` : ""}`}
                  className="font-bold hover:text-red-500 ml-1 cursor-pointer"
                >
                  ×
                </Link>
              </Badge>
            )}
            <Link
              href="/dashboard"
              className="text-xs font-black uppercase underline hover:text-neo-pink ml-2 cursor-pointer"
            >
              Clear All
            </Link>
          </div>
        )}

        {/* NOTES GRID */}
        {(notes || []).length === 0 ? (
          <Card
            bg="bg-white"
            className="flex-1 flex flex-col items-center justify-center text-center p-12 border-dashed border-4 border-zinc-400"
          >
            <div className="bg-neo-pink border-4 border-black p-4 rotate-[-3deg] shadow-neo-sm mb-6">
              <FileX className="h-12 w-12 text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-2">
              No Notes Found
            </h2>
            <p className="max-w-md font-bold text-zinc-600 mb-6">
              {search || tag
                ? "No notes matched your search criteria. Try modifying your filters or clear them to show all notes."
                : "You do not have any notes yet. Create your first note to get started with LWS Notebook."}
            </p>
            {search || tag ? (
              <Link href="/dashboard">
                <Button variant="yellow">Clear Search & Filters</Button>
              </Link>
            ) : (
              <Link href="/dashboard/notes/new">
                <Button variant="green">Create First Note</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(notes || []).map((note) => (
              <Card
                key={note?.id}
                bg="bg-white"
                className="flex flex-col justify-between gap-4 border-4 border-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all"
              >
                <div className="flex flex-col gap-2">
                  {/* Note Header & Title */}
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      href={`/dashboard/notes/${note?.id || ""}`}
                      className="hover:underline cursor-pointer"
                    >
                      <h3 className="text-xl font-black uppercase leading-tight text-black line-clamp-2">
                        {note?.title ?? "Untitled"}
                      </h3>
                    </Link>
                  </div>

                  {/* Date Metadata */}
                  <div className="text-[11px] font-black uppercase text-zinc-500 flex items-center gap-1 mb-2">
                    <Calendar className="h-3 w-3" />
                    {note?.createdAt
                      ? new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Unknown Date"}
                  </div>

                  {/* Description / Content Preview */}
                  <p className="font-semibold text-sm text-zinc-800 line-clamp-4 whitespace-pre-line leading-relaxed">
                    {note?.content || ""}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4 border-t-2 border-black pt-3">
                  {/* Badges list */}
                  <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {(note?.tags || []).length > 0 ? (
                      (note?.tags || []).map((t) => (
                        <Badge key={t?.id} variant={t?.color}>
                          {t?.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs font-semibold text-zinc-400 italic">
                        No tags
                      </span>
                    )}
                  </div>

                  {/* Actions Grid */}
                  <div className="flex gap-2 mt-1">
                    <Link
                      href={`/dashboard/notes/${note?.id || ""}`}
                      className="flex-1 cursor-pointer"
                    >
                      <Button
                        variant="white"
                        size="sm"
                        className="w-full text-xs py-1 flex items-center justify-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/notes/new?edit=${note?.id || ""}`}
                      className="flex-1 cursor-pointer"
                    >
                      <Button
                        variant="yellow"
                        size="sm"
                        className="w-full text-xs py-1 flex items-center justify-center gap-1"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                    </Link>
                    <DeleteButton noteId={note?.id} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
