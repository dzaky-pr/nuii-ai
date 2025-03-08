import Link from 'next/link'
import { redirect } from 'next/navigation'

import { SearchUsers } from '@/components/search-users'
import { UserActions } from '@/components/user-action'
import { checkRoleServer } from '@/lib/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  if (!checkRoleServer('admin')) {
    redirect('/')
  }

  const { search, page } = await params.searchParams
  const currentPage = parseInt(page || '1')
  const limit = 10
  const offset = (currentPage - 1) * limit

  const client = await clerkClient()
  const users = search
    ? (await client.users.getUserList({ query: search, limit, offset })).data
    : (await client.users.getUserList({ limit, offset })).data

  // Asumsikan kalau jumlah user sama dengan limit, kemungkinan masih ada halaman selanjutnya
  const hasNextPage = users.length === limit

  return (
    <div className="container mx-auto min-h-screen h-full p-6 bg-background">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <SearchUsers />
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-background border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-background">
            <tr>
              <th className="px-4 py-2 border border-gray-300">No.</th>
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
                  <td className="px-4 py-2 border-gray-300 border">
                    {offset + index + 1}
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
      <Pagination
        currentPage={currentPage}
        search={search}
        hasNextPage={hasNextPage}
      />
    </div>
  )
}

function Pagination({
  currentPage,
  search,
  hasNextPage
}: {
  currentPage: number
  search?: string
  hasNextPage: boolean
}) {
  const baseUrl = search ? `?search=${search}&` : '?'
  const pages: number[] = []

  // Tampilkan halaman sebelumnya kalau ada
  if (currentPage > 1) {
    pages.push(currentPage - 1)
  }
  pages.push(currentPage)
  if (hasNextPage) {
    pages.push(currentPage + 1)
  }

  return (
    <nav className="flex items-center justify-center mt-4 space-x-2">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}page=${currentPage - 1}`}
          className="text-blue-600 hover:text-blue-400"
        >
          <ChevronLeft />
        </Link>
      )}
      {pages.map(page => (
        <Link
          key={page}
          href={`${baseUrl}page=${page}`}
          className={`px-3 py-1 border ${
            page === currentPage ? 'bg-blue-500 text-white' : 'text-blue-500'
          }`}
        >
          {page === currentPage ? `${page}` : page}
        </Link>
      ))}
      {hasNextPage && (
        <Link
          href={`${baseUrl}page=${currentPage + 1}`}
          className="text-blue-600  hover:text-blue-400"
        >
          <ChevronRight />
        </Link>
      )}
    </nav>
  )
}
