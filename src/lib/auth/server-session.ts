import { getServerSession as getNextAuthServerSession } from 'next-auth/next'
import { authOptions } from './auth-config'

export async function getServerSession() {
  return await getNextAuthServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getServerSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  return session.user
} 