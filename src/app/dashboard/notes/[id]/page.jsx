import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/app/actions/auth';
import { getNoteById } from '@/app/actions/notes';
import { DeleteButton } from '@/components/delete-button';
import { ArrowLeft, Pencil, Calendar } from 'lucide-react';

export default async function NoteDetailsPage(props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const params = await props.params;
  const id = params.id;

  const note = await getNoteById(id);

  // Protect route if note does not exist or does not belong to logged-in user
  if (!note || note.userId !== user.id) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neo-bg">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Back Link */}
        <Link href="/dashboard" className="self-start flex items-center gap-2 font-black uppercase text-sm border-2 border-black bg-white px-3 py-1.5 shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo-md active:translate-x-[1px] active:translate-y-[1px] active:shadow-neo-sm transition-all cursor-pointer">
          <ArrowLeft className="h-4 w-4 stroke-[3]" />
          Back to Dashboard
        </Link>

        {/* Detailed Note Card */}
        <Card bg="bg-white" className="shadow-neo-lg border-4 border-black flex flex-col gap-6">
          {/* Note Metadata */}
          <div className="flex flex-col gap-2 border-b-4 border-black pb-4">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black">
              {note?.title ?? 'Untitled'}
            </h1>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-500">
              <Calendar className="h-3.5 w-3.5" />
              Created on:{' '}
              {note?.createdAt ? new Date(note.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) : 'Unknown Date'}
            </div>
          </div>

          {/* Note Body */}
          <div className="font-semibold text-base leading-relaxed text-zinc-800 whitespace-pre-wrap min-h-[150px]">
            {note?.content || ''}
          </div>

          {/* Tags Section */}
          <div className="border-t-4 border-black pt-4 flex flex-col gap-2">
            <div className="text-xs font-black uppercase text-zinc-500">
              Assigned Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {(note?.tags || []).length > 0 ? (
                (note?.tags || []).map((t) => (
                  <Badge key={t?.id} variant={t?.color}>
                    {t?.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm font-bold text-zinc-400 italic">
                  No tags associated with this note.
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t-4 border-black pt-4 flex flex-col sm:flex-row gap-4">
            <Link href={`/dashboard/notes/new?edit=${note?.id || ''}`} className="flex-1 cursor-pointer">
              <Button variant="yellow" className="w-full flex items-center justify-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit Note
              </Button>
            </Link>
            <DeleteButton noteId={note?.id} />
          </div>
        </Card>
      </div>
    </div>
  );
}
