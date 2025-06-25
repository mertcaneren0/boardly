import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@boardly.app' },
    update: {},
    create: {
      email: 'demo@boardly.app',
      name: 'Demo User',
      username: 'demouser',
      bio: 'Bu bir demo kullanıcıdır.',
      timezone: 'Europe/Istanbul',
      language: 'tr',
      currency: 'TRY'
    }
  })

  console.log('👤 Created demo user:', demoUser.email)

  // Create demo projects
  const projects = [
    {
      name: 'E-Ticaret Sitesi',
      slug: 'e-ticaret-sitesi',
      description: 'Modern ve kullanıcı dostu e-ticaret platformu geliştirme projesi.',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-15'),
      budget: 45000,
      clientName: 'ABC Şirketi',
      clientEmail: 'info@abc.com',
      clientPhone: '+90 532 123 4567'
    },
    {
      name: 'Mobil Uygulama',
      slug: 'mobil-uygulama',
      description: 'iOS ve Android için cross-platform mobil uygulama.',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-01'),
      budget: 35000,
      clientName: 'XYZ Tech',
      clientEmail: 'contact@xyztech.com',
      clientPhone: '+90 533 987 6543'
    },
    {
      name: 'Kurumsal Website',
      slug: 'kurumsal-website',
      description: 'Şirket kurumsal web sitesi yenileme projesi.',
      status: 'PLANNING' as const,
      priority: 'LOW' as const,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-01'),
      budget: 15000,
      clientName: 'DEF Holding',
      clientEmail: 'bilgi@defholding.com',
      clientPhone: '+90 534 456 7890'
    }
  ]

  for (const projectData of projects) {
    const project = await prisma.project.upsert({
      where: { 
        ownerId_slug: {
          ownerId: demoUser.id,
          slug: projectData.slug
        }
      },
      update: {},
      create: {
        ...projectData,
        ownerId: demoUser.id
      }
    })
    console.log('📂 Created project:', project.name)
  }

  // Create demo tasks
  const allProjects = await prisma.project.findMany({
    where: { ownerId: demoUser.id }
  })

  const tasks = [
    // E-Ticaret Sitesi tasks
    {
      title: 'Kullanıcı arayüzü tasarımı',
      description: 'Ana sayfa ve ürün listesi tasarımları',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      dueDate: new Date('2024-06-30T09:00:00'),
      estimatedHours: 16,
      projectId: allProjects.find(p => p.slug === 'e-ticaret-sitesi')?.id,
    },
    {
      title: 'Ödeme sistemi entegrasyonu',
      description: 'PayPal ve Stripe entegrasyonu',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      dueDate: new Date('2024-06-30T14:00:00'),
      estimatedHours: 12,
      projectId: allProjects.find(p => p.slug === 'e-ticaret-sitesi')?.id,
    },
    // Mobil Uygulama tasks
    {
      title: 'API geliştirme',
      description: 'Backend API endpoints',
      status: 'DONE' as const,
      priority: 'MEDIUM' as const,
      dueDate: new Date('2024-06-30T11:00:00'),
      completedAt: new Date('2024-06-20'),
      estimatedHours: 20,
      actualHours: 18,
      projectId: allProjects.find(p => p.slug === 'mobil-uygulama')?.id,
    },
    // Kurumsal Website tasks
    {
      title: 'İçerik yönetimi',
      description: 'CMS kurulumu ve içerik girişi',
      status: 'TODO' as const,
      priority: 'LOW' as const,
      dueDate: new Date('2024-06-30T10:00:00'),
      estimatedHours: 8,
      projectId: allProjects.find(p => p.slug === 'kurumsal-website')?.id,
    },
    {
      title: 'SEO optimizasyonu',
      description: 'Meta etiketler ve sitemap',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      dueDate: new Date('2024-06-30T16:00:00'),
      estimatedHours: 6,
      projectId: allProjects.find(p => p.slug === 'kurumsal-website')?.id,
    },
    {
      title: 'Responsive tasarım',
      description: 'Mobil uyumlu tasarım geliştirme',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      dueDate: new Date('2024-06-30T13:00:00'),
      estimatedHours: 10,
      projectId: allProjects.find(p => p.slug === 'kurumsal-website')?.id,
    }
  ]

  for (const taskData of tasks) {
    if (taskData.projectId) {
      const { projectId, ...restTaskData } = taskData
      const task = await prisma.task.create({
        data: {
          ...restTaskData,
          projectId: projectId,
          creatorId: demoUser.id,
          assigneeId: demoUser.id
        }
      })
      console.log('✅ Created task:', task.title)
    }
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 