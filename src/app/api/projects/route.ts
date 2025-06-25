import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  slug: z.string().min(1, 'Project slug is required'),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).default('PLANNING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
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

// GET /api/projects - List projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    const demoUserId = await getDemoUserId()
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user not found' },
        { status: 404 }
      )
    }

    const whereClause: any = {
      ownerId: demoUserId,
    }

    if (status && status !== 'all') {
      whereClause.status = status
    }

    if (priority && priority !== 'all') {
      whereClause.priority = priority
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            name: true,
            image: true,
          }
        },
        tasks: {
          select: {
            id: true,
            status: true,
          }
        },
        _count: {
          select: {
            tasks: true,
            files: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Calculate progress for each project
    const projectsWithProgress = projects.map(project => {
      const totalTasks = project.tasks.length
      const completedTasks = project.tasks.filter(task => task.status === 'DONE').length
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      return {
        ...project,
        progress,
        tasksCompleted: completedTasks,
        tasksTotal: totalTasks,
      }
    })

    return NextResponse.json({ projects: projectsWithProgress })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const demoUserId = await getDemoUserId()
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user not found' },
        { status: 404 }
      )
    }

    // Check if slug is unique for this user
    const existingProject = await prisma.project.findUnique({
      where: {
        ownerId_slug: {
          ownerId: demoUserId,
          slug: validatedData.slug,
        }
      }
    })

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project with this slug already exists' },
        { status: 400 }
      )
    }

    const newProject = await prisma.project.create({
      data: {
        ...validatedData,
        ownerId: demoUserId,
      },
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

    return NextResponse.json({ project: newProject }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 