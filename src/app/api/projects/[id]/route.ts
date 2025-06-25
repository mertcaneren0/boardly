import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  startDate: z.string().transform((str) => new Date(str)).optional(),
  endDate: z.string().transform((str) => new Date(str)).optional(),
  budget: z.number().positive().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().optional(),
})

// Get demo user ID from database
async function getDemoUserId() {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@boardly.app' }
  })
  return demoUser?.id || null
}

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            name: true,
            image: true,
            email: true,
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                name: true,
                image: true,
              }
            },
            creator: {
              select: {
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
        files: {
          orderBy: {
            createdAt: 'desc',
          }
        },
        notes: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            updatedAt: 'desc',
          }
        },
        _count: {
          select: {
            tasks: true,
            files: true,
            notes: true,
          }
        }
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Calculate progress
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(task => task.status === 'DONE').length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Calculate budget usage (mock data for now)
    const budgetUsed = project.budget ? project.budget * 0.65 : 0

    // Add team members (for now just the owner)
    const teamMembers = [
      {
        id: project.owner.name,
        name: project.owner.name,
        email: project.owner.email,
        image: project.owner.image,
        role: 'Project Owner',
        taskCount: project.tasks.filter(task => task.assigneeId === project.ownerId).length,
      }
    ]

    const projectWithStats = {
      ...project,
      progress,
      tasksCompleted: completedTasks,
      tasksTotal: totalTasks,
      budgetUsed,
      budgetUsage: project.budget ? Math.round((budgetUsed / project.budget) * 100) : 0,
      teamMembers,
    }

    return NextResponse.json({ project: projectWithStats })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

    // Check if project exists and get demo user
    const demoUserId = await getDemoUserId()
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user not found' },
        { status: 404 }
      )
    }

    const existingProject = await prisma.project.findUnique({
      where: { id },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user owns the project
    if (existingProject.ownerId !== demoUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: validatedData,
      include: {
        owner: {
          select: {
            name: true,
            image: true,
          }
        },
        _count: {
          select: {
            tasks: true,
            files: true,
          }
        }
      },
    })

    return NextResponse.json({ project: updatedProject })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
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

    const existingProject = await prisma.project.findUnique({
      where: { id },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user owns the project
    if (existingProject.ownerId !== demoUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete project (this will cascade delete tasks, files, notes due to schema relations)
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 