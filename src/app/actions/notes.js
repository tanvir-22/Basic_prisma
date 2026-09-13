'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from './auth';

// ---------------------------------------------------------------------------
// Dummy in-memory "database" for learning purposes.
// Persisted on globalThis so it survives Next.js dev-server hot reloads.
// Replace this with real database calls when you're ready.
// ---------------------------------------------------------------------------
const INITIAL_TAGS = [
  { id: 'tag-1', name: 'Database', color: 'neo-yellow' },
  { id: 'tag-2', name: 'Notes', color: 'neo-green' },
  { id: 'tag-3', name: 'Migration', color: 'neo-pink' },
  { id: 'tag-4', name: 'Frontend', color: 'neo-cyan' },
  { id: 'tag-5', name: 'Performance', color: 'neo-orange' },
];

const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Set Up The Project',
    content: 'Set up the local dev environment and configure environment variables. Verify everything runs correctly before building new features.',
    userId: 'user-1',
    createdAt: new Date('2026-06-01T10:00:00Z'),
    updatedAt: new Date('2026-06-01T10:00:00Z'),
    tags: [INITIAL_TAGS[0], INITIAL_TAGS[1]],
  },
  {
    id: 'note-2',
    title: 'Plan The Data Model',
    content: 'Sketch out the shape of the data this app needs and how the pieces relate to each other before writing any storage code.',
    userId: 'user-1',
    createdAt: new Date('2026-06-10T14:30:00Z'),
    updatedAt: new Date('2026-06-10T14:30:00Z'),
    tags: [INITIAL_TAGS[2], INITIAL_TAGS[0]],
  },
  {
    id: 'note-3',
    title: 'Avoid Duplicate State On Hot Reload',
    content: 'Cache long-lived in-memory state on globalThis so the development server does not reset it on every file save during hot reloads.',
    userId: 'user-1',
    createdAt: new Date('2026-06-15T09:00:00Z'),
    updatedAt: new Date('2026-06-15T09:00:00Z'),
    tags: [INITIAL_TAGS[1], INITIAL_TAGS[4]],
  },
  {
    id: 'note-4',
    title: 'Resolve Hydration Mismatches In Layouts',
    content: 'Avoid layouts rendering mismatched markup by checking window state before calling browser storage APIs. Maintain client-server HTML parity by only mounting stateful UI elements post mount.',
    userId: 'user-1',
    createdAt: new Date('2026-06-16T11:00:00Z'),
    updatedAt: new Date('2026-06-16T11:00:00Z'),
    tags: [INITIAL_TAGS[3]],
  },
];

globalThis.mockTags = globalThis.mockTags || [...INITIAL_TAGS];
globalThis.mockNotes = globalThis.mockNotes || [...INITIAL_NOTES];

export async function getTags() {
  try {
    return [...globalThis.mockTags];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getNotes(filters = {}) {
  try {
    let notes = [...globalThis.mockNotes];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          n.content.toLowerCase().includes(term)
      );
    }

    if (filters.tag) {
      notes = notes.filter((n) =>
        (n.tags || []).some((t) => t.name === filters.tag)
      );
    }

    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return notes;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getNoteById(id) {
  try {
    const note = globalThis.mockNotes.find((n) => n.id === id);
    return note || null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createNote(prevState, formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  const tagIds = formData.getAll('tags');

  if (!title || !content) {
    return { success: false, error: 'Title and content are required.' };
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in.' };
    }

    const tags = globalThis.mockTags.filter((t) => tagIds.includes(t.id));

    const note = {
      id: `note-${Date.now()}`,
      title,
      content,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags,
    };
    globalThis.mockNotes.push(note);
  } catch (err) {
    console.log(err);
    return { success: false, error: 'Failed to create note.' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateNote(noteId, prevState, formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  const tagIds = formData.getAll('tags');

  if (!title || !content) {
    return { success: false, error: 'Title and content are required.' };
  }

  try {
    const note = globalThis.mockNotes.find((n) => n.id === noteId);
    if (!note) {
      return { success: false, error: 'Note not found.' };
    }

    note.title = title;
    note.content = content;
    note.tags = globalThis.mockTags.filter((t) => tagIds.includes(t.id));
    note.updatedAt = new Date();
  } catch (err) {
    console.log(err);
    return { success: false, error: 'Failed to update note.' };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteNote(noteId) {
  try {
    const index = globalThis.mockNotes.findIndex((n) => n.id === noteId);
    if (index === -1) {
      return { success: false, error: 'Note not found.' };
    }
    globalThis.mockNotes.splice(index, 1);
  } catch (err) {
    console.log(err);
    return { success: false, error: 'Failed to delete note.' };
  }
  revalidatePath('/dashboard');
  return { success: true };
}
