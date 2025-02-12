import { cn } from '@/lib/utils'
import { getUserRoleServer } from '@/lib/utils/roles'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { headers } from 'next/headers'
import Link from 'next/link'
import HistoryContainer from './history-container'
import { ModeToggle } from './mode-toggle'
import { IconLogo } from './ui/icons'
import UserButtonCustom from './user-button'

export const Header: React.FC = async () => {
  const role = await getUserRoleServer()
  const pathname = (await headers()).get('next-url') || '' // Ambil URL dari headers

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
              <p>
                Role:{' '}
                {role
                  ? role.toString().charAt(0).toUpperCase() +
                    role.toString().slice(1)
                  : 'Not Verified'}
              </p>
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
