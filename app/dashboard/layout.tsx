import AccessGuard from '@/components/access-guard-role'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AccessGuard>{children}</AccessGuard>
}
