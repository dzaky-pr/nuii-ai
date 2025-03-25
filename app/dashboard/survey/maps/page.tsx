'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RoutingMap from './_components/RoutingMap'

export default function ExampleMapPage() {
  const router = useRouter()

  return (
    <div className="pt-4 pb-10 px-10 flex flex-col gap-4 z-0">
      <Button
        asChild
        size="icon"
        variant="outline"
        onClick={() => router.back()}
      >
        <Link href="/dashboard/survey">
          <ArrowLeft size={16} />
        </Link>
      </Button>
      <RoutingMap />
    </div>
  )
}
