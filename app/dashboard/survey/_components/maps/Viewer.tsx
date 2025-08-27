'use client'

import { SurveyDetail } from '@/lib/types/old-survey'
import Point from 'ol/geom/Point'
import 'ol/ol.css'
import { fromLonLat } from 'ol/proj'
import { useEffect, useState } from 'react'
import { RFeature, RLayerVector, RMap, ROSM, ROverlay } from 'rlayers'

export function MapViewer({ surveys }: { surveys: SurveyDetail[] }) {
  // Gunakan survey pertama sebagai center, atau default
  const initialCoord =
    surveys.length > 0
      ? fromLonLat([Number(surveys[0].long), Number(surveys[0].lat)])
      : fromLonLat([106.8272, -6.1754])
  const [center, setCenter] = useState(initialCoord)
  // State untuk melacak overlay marker per index
  const [overlayVisibility, setOverlayVisibility] = useState<
    Record<number, boolean>
  >({})

  useEffect(() => {
    if (surveys.length > 0) {
      const newCenter = fromLonLat([
        Number(surveys[0].long),
        Number(surveys[0].lat)
      ])
      setCenter(newCenter)
    }
  }, [surveys])

  return (
    <div className="relative h-[600px] w-full">
      <RMap initial={{ center, zoom: 17 }} className="h-full w-full">
        <ROSM />
        <RLayerVector>
          {surveys.map((survey, idx) => {
            const coord = fromLonLat([Number(survey.long), Number(survey.lat)])
            return (
              <RFeature
                key={idx}
                geometry={new Point(coord)}
                onPointerEnter={() =>
                  setOverlayVisibility(prev => ({ ...prev, [idx]: true }))
                }
                onPointerLeave={() =>
                  setOverlayVisibility(prev => ({ ...prev, [idx]: false }))
                }
                onClick={() =>
                  setOverlayVisibility(prev => ({
                    ...prev,
                    [idx]: !prev[idx]
                  }))
                }
              >
                {overlayVisibility[idx] && (
                  <ROverlay className="bg-background p-2 rounded shadow text-xs">
                    {survey.id_material_tiang} - {survey.keterangan}
                  </ROverlay>
                )}
              </RFeature>
            )
          })}
        </RLayerVector>
      </RMap>
    </div>
  )
}
