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
      if (!user) {
        toast.error('Anda tidak memiliki akses!', {})
        router.push('/')
      } else if (!user.publicMetadata?.role) {
        toast.error('Anda belum diverifikasi oleh Admin!', {})
        router.push('/')
      } else if (
        user.publicMetadata.role !== 'user' &&
        user.publicMetadata.role !== 'admin'
      ) {
        toast.error('Akses ditolak!', {})
        router.push('/')
      }
    }
  }, [isLoaded, user, router])

  if (!isLoaded || !user || !user.publicMetadata?.role) {
    return <Spinner />
  }

  if (
    user.publicMetadata.role === 'user' ||
    user.publicMetadata.role === 'admin'
  ) {
    return <>{children}</>
  }

  return null
}
