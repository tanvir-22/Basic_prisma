"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { prisma } from "@/lib/prisma";


// ---------------------------------------------------------------------------
// Dummy in-memory "database" for learning purposes.
// Persisted on globalThis so it survives Next.js dev-server hot reloads.
// Replace this with real database calls when you're ready.
// ---------------------------------------------------------------------------
// const INITIAL_TAGS = [
//   { id: 'tag-1', name: 'Database', color: 'neo-yellow' },
//   { id: 'tag-2', name: 'Notes', color: 'neo-green' },
//   { id: 'tag-3', name: 'Migration', color: 'neo-pink' },
//   { id: 'tag-4', name: 'Frontend', color: 'neo-cyan' },
//   { id: 'tag-5', name: 'Performance', color: 'neo-orange' },
// ];

// const INITIAL_NOTES = [
//   {
//     id: 'note-1',
//     title: 'Set Up The Project',
//     content: 'Set up the local dev environment and configure environment variables. Verify everything runs correctly before building new features.',
//     userId: 'user-1',
//     createdAt: new Date('2026-06-01T10:00:00Z'),
//     updatedAt: new Date('2026-06-01T10:00:00Z'),
//     tags: [INITIAL_TAGS[0], INITIAL_TAGS[1]],
//   },
//   {
//     id: 'note-2',
//     title: 'Plan The Data Model',
//     content: 'Sketch out the shape of the data this app needs and how the pieces relate to each other before writing any storage code.',
//     userId: 'user-1',
//     createdAt: new Date('2026-06-10T14:30:00Z'),
//     updatedAt: new Date('2026-06-10T14:30:00Z'),
//     tags: [INITIAL_TAGS[2], INITIAL_TAGS[0]],
//   },
//   {
//     id: 'note-3',
//     title: 'Avoid Duplicate State On Hot Reload',
//     content: 'Cache long-lived in-memory state on globalThis so the development server does not reset it on every file save during hot reloads.',
//     userId: 'user-1',
//     createdAt: new Date('2026-06-15T09:00:00Z'),
//     updatedAt: new Date('2026-06-15T09:00:00Z'),
//     tags: [INITIAL_TAGS[1], INITIAL_TAGS[4]],
//   },
//   {
//     id: 'note-4',
//     title: 'Resolve Hydration Mismatches In Layouts',
//     content: 'Avoid layouts rendering mismatched markup by checking window state before calling browser storage APIs. Maintain client-server HTML parity by only mounting stateful UI elements post mount.',
//     userId: 'user-1',
//     createdAt: new Date('2026-06-16T11:00:00Z'),
//     updatedAt: new Date('2026-06-16T11:00:00Z'),
//     tags: [INITIAL_TAGS[3]],
//   },
// ];

// globalThis.mockTags = globalThis.mockTags || [...INITIAL_TAGS];
// globalThis.mockNotes = globalThis.mockNotes || [...INITIAL_NOTES];

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany(); //
    return tags;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getNotes(filters = {}) {
   const where = {};
   if (filters.search) {//
     where.OR = [
       {
         title: { contains: filters.search, mode: "insensitive" },
       },
       {
         content: { contains: filters.search, mode: "insensitive" },
       },
     ];
   }
   if(filters.tag){
    where.tags = {//
      some: {
        name:filters.tag
      }
    }
   }
  try {
    let notes = await prisma.note.findMany({
      //
      where,
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
   

    if (filters.tag) {
      notes = notes.filter((n) =>
        (n.tags || []).some((t) => t.name === filters.tag),
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
    const note = await prisma.note.findUnique({
      //
      where: {
        id,
      },
      include: {
        tags: true,
      },
    });
    return note;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createNote(prevState, formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const tagIds = formData.getAll("tags");

  if (!title || !content) {
    return { success: false, error: "Title and content are required." };
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be logged in." };
    }
    await prisma.note.create({
      //
      data: {
        title,
        content,
        userId: user.id,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });
    console.log("new post added");
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to create note." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateNote(noteId, prevState, formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const tagIds = formData.getAll("tags");

  if (!title || !content) {
    return { success: false, error: "Title and content are required." };
  }

  try {
    await prisma.note.update({
      //
      where: {
        id: noteId,
      },
      data: {
        title,
        content,
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
      },
    });
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to update note." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteNote(noteId) {
  try {
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to delete note." };
  }
  revalidatePath("/dashboard");
  return { success: true };
}
