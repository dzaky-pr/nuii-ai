import { auth, clerkClient } from '@clerk/nextjs/server'
import { Roles } from '../types/globals'

export const checkRoleServer = async (role: Roles) => {
  const { userId } = await auth()
  if (!userId) return false

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const userRole = user.publicMetadata.role

  return userRole === role
}

export const getUserRoleServer = async () => {
  const { userId } = await auth()
  if (!userId) return null

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  return user.publicMetadata.role || undefined
}
