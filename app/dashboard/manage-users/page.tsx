import { redirect } from 'next/navigation'

import { SearchUsers } from '@/components/search-users'
import { UserActions } from '@/components/user-action'
import { checkRoleServer } from '@/lib/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

export default async function AdminDashboard(params: {
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
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

      <SearchUsers />

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-background border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-background ">
            <tr>
              <th className="px-4 py-2 border border-gray-300 ">No.</th>
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">
                Primary Email
              </th>
              <th className="px-4 py-2 border border-gray-300">User ID</th>
              <th className="px-4 py-2 border border-gray-300">Role</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-2 text-center flex items-center justify-center"
                  colSpan={6}
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2  border-gray-300 border">
                    {index + 1}
                  </td>

                  <td className="px-4 py-2 border-gray-300 border">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-2 border-gray-300 border">
                    {
                      user.emailAddresses.find(
                        email => email.id === user.primaryEmailAddressId
                      )?.emailAddress
                    }
                  </td>
                  <td className="px-4 py-2 border-gray-300 border">
                    {user.id}
                  </td>
                  <td className="px-4 py-2 border-gray-300 border">
                    {user.publicMetadata.role as string}
                  </td>
                  <td className="px-4 py-2 border-gray-300 border">
                    <UserActions
                      userId={user.id}
                      userName={`${user.firstName} ${user.lastName}`}
                      userEmail={
                        user.emailAddresses.find(
                          email => email.id === user.primaryEmailAddressId
                        )?.emailAddress || ''
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
