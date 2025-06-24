import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/server-session'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['GENERAL', 'MEETING', 'IDEA', 'TODO', 'RESEARCH', 'CLIENT', 'TECHNICAL', 'FINANCIAL']).default('GENERAL'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  tags: z.array(z.string()).default([]),
  projectId: z.string().optional(),
  workspaceId: z.string().optional(),
})

// GET /api/notes - List notes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const workspaceId = searchParams.get('workspaceId')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const archived = searchParams.get('archived') === 'true'
    const pinned = searchParams.get('pinned') === 'true'
    const search = searchParams.get('search')

    const whereClause: any = {
      authorId: session.user.id,
      isArchived: archived,
    }

    if (projectId) {
      whereClause.projectId = projectId
    } else if (workspaceId) {
      whereClause.workspaceId = workspaceId
    } else {
      // Dashboard notes (no project or workspace)
      whereClause.projectId = null
      whereClause.workspaceId = null
    }

    if (category && category !== 'all') {
      whereClause.category = category
    }

    if (priority && priority !== 'all') {
      whereClause.priority = priority
    }

    if (pinned) {
      whereClause.isPinned = true
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    const notes = await prisma.note.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        project: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/notes - Create note
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createNoteSchema.parse(body)

    // If projectId is provided, verify user has access to the project
    if (validatedData.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: validatedData.projectId,
          ownerId: session.user.id,
        },
      })

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found or access denied' },
          { status: 404 }
        )
      }
    }

    // If workspaceId is provided, verify user is a member
    if (validatedData.workspaceId) {
      const membership = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: validatedData.workspaceId,
          userId: session.user.id,
        },
      })

      if (!membership) {
        return NextResponse.json(
          { error: 'Workspace not found or access denied' },
          { status: 404 }
        )
      }
    }

    const note = await prisma.note.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        project: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 