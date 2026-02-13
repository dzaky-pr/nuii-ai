import { checkRoleServer } from '@/lib/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

import { redirect } from 'next/navigation'
import { LogTable } from './_components/LogTable'

import LogHistoryTitle from './_components/Title'

export default async function ManageMaterials(params: {
  searchParams: Promise<{ search?: string }>
}) {
  if (!checkRoleServer('admin')) {
    redirect('/')
  }

  const query = (await params.searchParams).search
  const client = await clerkClient()

  // Masih menggunakan query untuk kebutuhan user, bukan filtering material
  const users = query
    ? (await client.users.getUserList({ query })).data
    : (await client.users.getUserList()).data

  return (
    <div className="container mx-auto min-h-screen h-full p-6 bg-background">
      <LogHistoryTitle />

      <LogTable />
    </div>
  )
}
