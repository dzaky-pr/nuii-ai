'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

function LogHistoryTitle() {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-2">
      <Button
        asChild
        size="icon"
        variant="outline"
        onClick={() => router.push('/dashboard/manage-materials')}
        className="hover:cursor-pointer"
      >
        <span>
          <ArrowLeft size={20} />
        </span>
      </Button>
      <h2 className="text-2xl font-semibold mb-4">
        Log History (Terbaru ke Terlama)
      </h2>
    </div>
  )
}

export default LogHistoryTitle
