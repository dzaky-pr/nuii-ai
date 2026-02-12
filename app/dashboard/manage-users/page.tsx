import Link from 'next/link'
import { redirect } from 'next/navigation'

import { checkRoleServer } from '@/lib/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { SearchUsers } from './_components/SearchUsers'
import { UserActions } from './_components/UserActions'
import { PaginationControls } from './_components/PaginationControls'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>
}) {
  if (!checkRoleServer('admin')) {
    redirect('/')
  }

  const { search, page, limit: queryLimit } = await params.searchParams
  const currentPage = parseInt(page || '1')
  const limit = parseInt(queryLimit || '10')
  const offset = (currentPage - 1) * limit

  const client = await clerkClient()
  const users = await (
    await client.users.getUserList({
      query: search,
      limit,
      offset
    })
  ).data

  // Fetch total count for pagination
  const totalCount = await client.users.getCount({ query: search })
  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="container mx-auto min-h-screen h-full p-6 bg-background">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <SearchUsers />
      <div className="mt-6">
        <div className="rounded-md border bg-background shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Primary Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{offset + index + 1}</TableCell>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      {
                        user.emailAddresses.find(
                          email => email.id === user.primaryEmailAddressId
                        )?.emailAddress
                      }
                    </TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.publicMetadata.role as string}</TableCell>
                    <TableCell>
                      <UserActions
                        userId={user.id}
                        userName={`${user.firstName} ${user.lastName}`}
                        userEmail={
                          user.emailAddresses.find(
                            email => email.id === user.primaryEmailAddressId
                          )?.emailAddress || ''
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        totalItems={totalCount}
      />
    </div>
  )
}
