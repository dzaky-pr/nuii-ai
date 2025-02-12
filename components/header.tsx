import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import HistoryContainer from './history-container'
import { ModeToggle } from './mode-toggle'
import { IconLogo } from './ui/icons'
import UserButtonCustom from './user-button'

export const Header: React.FC = async () => {
  return (
    <header className="shadow-lg bg-background px-6 sm:px-10 py-3 sticky top-0 w-full flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none ">
      <div>
        <Link href="/">
          <IconLogo className={cn('w-8 h-8')} />
          <span className="sr-only">NUII AI</span>
        </Link>
      </div>
      <div className="flex gap-1 md:gap-2 lg:gap-3 items-center">
        <div className="flex w-fit h-fit ">
          <SignedOut>
            <div className="border px-4 py-2 border-primary rounded-lg hover:bg-primary-foreground">
              <SignInButton />
            </div>
          </SignedOut>

          <SignedIn>
            <div className="border w-fit h-fit flex p-1.5 border-primary rounded-full">
              <UserButtonCustom />
            </div>
          </SignedIn>
        </div>
        <ModeToggle />
        <HistoryContainer location="header" />
      </div>
    </header>
  )
}

export default Header
