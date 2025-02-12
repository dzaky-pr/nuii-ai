import AccessGuard from '@/components/access-guard-role'
import { Sidebar } from '@/components/sidebar'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const enableSaveChatHistory =
    process.env.NEXT_PUBLIC_ENABLE_SAVE_CHAT_HISTORY === 'true'

  return (
    <AccessGuard>
      {children}
      {enableSaveChatHistory && <Sidebar />}
    </AccessGuard>
  )
}
