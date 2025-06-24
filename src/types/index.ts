// Re-export Prisma types for easier importing
export type {
  User,
  Project,
  Task,
  Payment,
  Workspace,
  WorkspaceMember,
  Chat,
  Message,
  Comment,
  ProjectFile,
  Note,
  Role,
  ProjectStatus,
  TaskStatus,
  Priority,
  PaymentType,
  PaymentStatus,
  ChatType,
  MessageType,
  NoteCategory,
} from '../generated/prisma/index'

// Custom types for the application
export interface CreateProjectData {
  name: string
  description?: string
  clientName?: string
  clientEmail?: string
  budget?: number
  startDate?: Date
  endDate?: Date
}

export interface CreateTaskData {
  title: string
  description?: string
  projectId: string
  assigneeId?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
  estimatedHours?: number
  tags?: string[]
}

export interface CreatePaymentData {
  title: string
  description?: string
  amount: number
  currency?: string
  type: 'INCOMING' | 'OUTGOING'
  projectId: string
  dueDate?: Date
  invoiceDate?: Date
  method?: string
}

export interface CreateNoteData {
  title: string
  content: string
  category?: 'GENERAL' | 'MEETING' | 'IDEA' | 'TODO' | 'RESEARCH' | 'CLIENT' | 'TECHNICAL' | 'FINANCIAL'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  tags?: string[]
  projectId?: string
  workspaceId?: string
  contentType?: string
}

export interface UpdateNoteData extends Partial<CreateNoteData> {
  id: string
  isPinned?: boolean
  isArchived?: boolean
}

// Dashboard types
export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedTasks: number
  pendingPayments: number
  totalEarnings: number
  thisMonthEarnings: number
}

// Will be defined when Project type is properly imported

// Note: Complex types with relations will be defined later when needed

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Permission types
export interface UserPermissions {
  canViewProjects: boolean
  canEditProjects: boolean
  canDeleteProjects: boolean
  canViewFinances: boolean
  canEditFinances: boolean
  canManageTeam: boolean
  canViewAnalytics: boolean
}

// Calendar types
export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'task' | 'payment' | 'project_deadline' | 'meeting'
  status?: 'pending' | 'completed' | 'overdue'
  color?: string
  projectId?: string
} 