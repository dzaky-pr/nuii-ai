'use client'

import { Spinner } from '@/components/ui/spinner'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

interface AccessGuardProps {
  children: React.ReactNode
}

export default function AccessGuard({ children }: AccessGuardProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      const role = String(user?.publicMetadata?.role || '')

      if (!user) {
        toast.error('Anda tidak memiliki akses!')
        router.push('/')
      } else if (!role) {
        toast.error('Anda belum diverifikasi oleh Admin!')
        router.push('/')
      } else if (!['admin', 'pengawas', 'surveyor'].includes(role)) {
        toast.error('Akses ditolak!')
        router.push('/')
      }
    }
  }, [isLoaded, user, router])

  const role = String(user?.publicMetadata?.role || '')

  if (!isLoaded || !user || !role) {
    return (
      <div className="grid place-items-center min-h-svh">
        <Spinner />
      </div>
    )
  }

  if (['admin', 'pengawas', 'surveyor'].includes(role)) {
    return <>{children}</>
  }

  return null
}
