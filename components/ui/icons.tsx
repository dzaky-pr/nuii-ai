'use client'

import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    // <svg
    //   fill="currentColor"
    //   viewBox="0 0 256 256"
    //   role="img"
    //   xmlns="http://www.w3.org/2000/svg"
    //   className={cn('h-4 w-4', className)}
    //   {...props}
    // >
    //   <circle cx="128" cy="128" r="128" fill="black"></circle>
    //   <circle cx="102" cy="128" r="18" fill="white"></circle>
    //   <circle cx="154" cy="128" r="18" fill="white"></circle>
    // </svg>

    <svg
      fill="currentColor"
      viewBox="0 0 256 256"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-4 w-4 border rounded-full', className)}
      {...props}
    >
      <circle cx="128" cy="128" r="120" fill="white" />
      <rect x="48" y="72" width="160" height="112" rx="32" fill="black" />
      <circle cx="80" cy="128" r="18" fill="white" />
      <circle cx="176" cy="128" r="18" fill="white" />
      <rect x="96" y="176" width="64" height="8" fill="white" />
      <rect x="112" y="160" width="32" height="8" fill="white" />
    </svg>
  )
}

export { IconLogo }
