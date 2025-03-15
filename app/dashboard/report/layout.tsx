import AccessGuard from '@/components/access-guard-role'
import { checkRoleServer } from '@/lib/utils/roles'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  if (
    !(await checkRoleServer('admin')) &&
    !(await checkRoleServer('pengawas'))
  ) {
    redirect('/')
  }

  return <AccessGuard>{children}</AccessGuard>
}
