'use client'

import { Button } from '@/components/ui/button'
import useRouteStore from '@/lib/hooks/useRouteStore'
import { getCookie, setCookie } from '@/lib/utils/cookies'
import L from 'leaflet'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import CreateBatchForm from './_components/CreateBatchForm'
import RoutingMap from './_components/RoutingMap'
import { useEstimationMutation } from './_hooks/useEstimationMutation'

export default function MapPage() {
  const [waypoints, setWaypoints] = useState<L.LatLng[]>([])
  const [instructionText, setInstructionText] = useState<string>(
    'Tap pada peta untuk memilih titik awal.'
  )
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState<boolean>(false)

  const routingMode = getCookie('routing-mode') as 'select' | 'view' | null

  const { route, setRoute, setEstimation } = useRouteStore()
  const { mutate, isPending } = useEstimationMutation()

  const handleReset = () => {
    if (routingMode === 'select') {
      setWaypoints([])
      setRoute({})
    } else if (routingMode === 'view') {
      setCookie('routing-mode', 'select')
      setWaypoints([])
      setRoute({})
      setEstimation({})
    }
    setInstructionText('Tap pada peta untuk memilih titik awal.')
    toast.info('Rute direset. Silakan pilih titik awal baru.')
  }

  useEffect(() => {
    setCookie('routing-mode', 'select')
  }, [])

  return (
    <div className="pt-4 pb-10 px-10 flex flex-col gap-4 z-0">
      <Button asChild size="icon" variant="outline">
        <Link href="/dashboard/survey">
          <ArrowLeft size={16} />
        </Link>
      </Button>
      <div className="flex flex-col gap-4 w-full text-center">
        <p className="font-medium text-neutral-100">{instructionText}</p>
        <RoutingMap
          waypoints={waypoints}
          routingMode={routingMode}
          setWaypoints={setWaypoints}
          setInstructionText={setInstructionText}
          setIsSubmitBtnDisabled={setIsSubmitBtnDisabled}
        />
        <div className="flex gap-4 self-end">
          <Button
            size="sm"
            onClick={handleReset}
            className="bg-red-500 text-white hover:bg-red-600 w-fit self-center"
            disabled={waypoints.length < 1}
          >
            Reset
          </Button>
          {routingMode === 'select' ? (
            <Button
              size="sm"
              className="bg-green-500 text-white hover:bg-green-600 w-fit self-center"
              disabled={
                waypoints.length < 2 || isSubmitBtnDisabled || isPending
              }
              onClick={() => route && mutate(route)}
            >
              Submit
            </Button>
          ) : (
            <CreateBatchForm />
          )}
        </div>
      </div>
    </div>
  )
}
