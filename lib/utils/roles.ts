import { auth, clerkClient } from '@clerk/nextjs/server'
import { Roles } from '../types/globals'

export const checkRoleServer = async (role: Roles) => {
  try {
    const { userId } = await auth()
    if (!userId) return false

    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const userRole = user.publicMetadata.role

    return userRole === role
  } catch (error) {
    console.error('Failed to read user role:', error)
    return false
  }
}

export const getUserRoleServer = async () => {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    return user.publicMetadata.role || undefined
  } catch (error) {
    console.error('Failed to read user role:', error)
    return null
  }
}
