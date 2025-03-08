import { redirect } from 'next/navigation'

import { SearchMaterials } from '@/components/search-materials'
import { checkRoleServer } from '@/lib/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { MaterialTable } from './_components/MaterialTable'

export default async function ManageMaterials(params: {
  searchParams: Promise<{ search?: string }>
}) {
  if (!checkRoleServer('admin')) {
    redirect('/')
  }

  const query = (await params.searchParams).search
  const client = await clerkClient()

  // Jika ada query pencarian, cari pengguna, jika tidak, ambil semua pengguna
  const users = query
    ? (await client.users.getUserList({ query })).data
    : (await client.users.getUserList()).data // Menampilkan semua user jika tidak ada query pencarian

  return (
    <div className="container mx-auto min-h-screen h-full p-6 bg-background">
      <h2 className="text-2xl font-semibold mb-4">Manage Materials</h2>
      <SearchMaterials />

      <MaterialTable />
    </div>
  )
}
