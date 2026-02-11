'use client'

import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HistoryContainer from './history-container'
import { ModeToggle } from './mode-toggle'
import { IconLogo } from './ui/icons'
import UserButtonCustom from './user-button'

const formatRoleLabel = (role: unknown) => {
  if (typeof role !== 'string' || role.length === 0) return 'Not Verified'

  return role.charAt(0).toUpperCase() + role.slice(1)
}

export const Header: React.FC = () => {
  const pathname = usePathname()
  const { user } = useUser()
  const role = user?.publicMetadata?.role

  return (
    <header className="shadow-lg bg-background px-6 sm:px-10 py-3 sticky top-0 w-full flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none">
      <div>
        <Link href="/">
          <IconLogo className={cn('w-8 h-8')} />
          <span className="sr-only">NUII AI</span>
        </Link>
      </div>
      <div className="flex gap-1 md:gap-2 lg:gap-3 items-center">
        <div className="flex w-fit h-fit">
          <SignedOut>
            <div className="border px-4 py-2 border-primary rounded-lg hover:bg-primary-foreground">
              <SignInButton />
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex flex-row items-center justify-center gap-2">
              <p>Role: {formatRoleLabel(role)}</p>
              <div className="border w-fit h-fit flex p-1.5 border-primary rounded-full">
                <UserButtonCustom />
              </div>
            </div>
          </SignedIn>
        </div>
        <ModeToggle />
        {pathname === '/dashboard/chat' && (
          <HistoryContainer location="header" />
        )}
      </div>
    </header>
  )
}

export default Header
