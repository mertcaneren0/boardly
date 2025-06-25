import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Get demo user ID from database
async function getDemoUserId() {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@boardly.app' }
  })
  return demoUser?.id || null
}

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
})

const updateTaskSchema = createTaskSchema.partial()

// GET /api/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const demoUserId = await getDemoUserId()
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const tasks = await prisma.task.findMany({
      where: {
        project: {
          ownerId: demoUserId,
          ...(projectId && { id: projectId }),
        },
        ...(status && { status: status as any }),
        ...(priority && { priority: priority as any }),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const demoUserId = await getDemoUserId()
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = createTaskSchema.parse(body)

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: validatedData.projectId,
        ownerId: demoUserId,
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        projectId: validatedData.projectId,
        priority: validatedData.priority,
        status: validatedData.status,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        assigneeId: validatedData.assigneeId,
        creatorId: demoUserId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 