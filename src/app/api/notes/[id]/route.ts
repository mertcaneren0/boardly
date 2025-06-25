import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  category: z.enum(['GENERAL', 'MEETING', 'IDEA', 'TODO', 'RESEARCH', 'CLIENT', 'TECHNICAL', 'FINANCIAL']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
})

// Get demo user ID from database
async function getDemoUserId() {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@boardly.app' }
  })
  return demoUser?.id || null
}

// GET /api/notes/[id] - Get single note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
      },
    })

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/notes/[id] - Update note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const validatedData = updateNoteSchema.parse(body)

    // Check if note exists and get demo user
    const demoUserId = await getDemoUserId()
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user not found' },
        { status: 404 }
      )
    }

    const existingNote = await prisma.note.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    // Check if user owns the note
    if (existingNote.authorId !== demoUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: validatedData,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
      },
    })

    return NextResponse.json({ note: updatedNote })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/notes/[id] - Delete note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get demo user
    const demoUserId = await getDemoUserId()
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user not found' },
        { status: 404 }
      )
    }

    const existingNote = await prisma.note.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    // Check if user owns the note
    if (existingNote.authorId !== demoUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 