'use server'

import { checkRoleServer } from '@/lib/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

export async function setRole(formData: FormData) {
  if (!checkRoleServer('admin')) {
    return { error: 'Unauthorized' }
  }

  try {
    const client = await clerkClient()
    await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') }
    })
    return { success: true }
  } catch (err) {
    console.error('Error setting role:', err)
    return { error: 'Failed to set role' }
  }
}

export async function removeRole(formData: FormData) {
  try {
    const client = await clerkClient()
    await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null }
    })
    return { success: true }
  } catch (err) {
    console.error('Error removing role:', err)
    return { error: 'Failed to remove role' }
  }
}
