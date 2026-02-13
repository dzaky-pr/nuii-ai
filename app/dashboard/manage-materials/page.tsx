import { checkRoleServer } from '@/lib/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { MaterialTable } from './_components/MaterialTable'
import CreateNewMaterialForm from './_components/CreateNewMaterialForm'

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Materials</h2>
        <CreateNewMaterialForm />
      </div>

      <MaterialTable />
    </div>
  )
}
