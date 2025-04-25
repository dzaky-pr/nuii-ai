'use client'

import { SurveyDetailExtended } from '@/lib/types/survey'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const Routing = ({ surveys }: { surveys: SurveyDetailExtended[] }) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    L.Routing.control({
      waypoints: [
        L.latLng(Number(surveys[0].lat), Number(surveys[0].long)),
        L.latLng(
          Number(surveys[surveys.length - 1].lat),
          Number(surveys[surveys.length - 1].long)
        )
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving'
      }),
      show: false,
      routeWhileDragging: false,
      showAlternatives: false,
      lineOptions: {
        missingRouteTolerance: 0,
        extendToWaypoints: false,
        styles: [{ color: '#757de8', weight: 6, opacity: 0.75 }]
      },
      altLineOptions: {
        missingRouteTolerance: 0,
        extendToWaypoints: false,
        styles: [{ color: '#aab6ff', weight: 4, opacity: 0.65 }]
      }
    }).addTo(map)
  }, [map, surveys])

  return null
}

export default function LeafletMapViewer({
  surveys
}: {
  surveys: SurveyDetailExtended[]
}) {
  const [center, setCenter] = useState<[number, number]>(
    surveys.length > 0
      ? [Number(surveys[0].lat), Number(surveys[0].long)]
      : [-6.1754, 106.8272]
  )

  useEffect(() => {
    if (surveys.length > 0) {
      setCenter([Number(surveys[0].lat), Number(surveys[0].long)])
    }
  }, [surveys])

  return (
    <div className="relative h-64 w-full">
      <MapContainer
        center={center}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Routing surveys={surveys} />
        {surveys.map((survey, idx) => (
          <Marker
            key={idx}
            position={[Number(survey.lat), Number(survey.long)]}
          >
            <Popup>
              <div className="w-fit">
                <h4 className="text-lg font-bold">Detail Tiang {idx + 1}</h4>
                <div className="mt-2">
                  <p>
                    <strong>Konstruksi:</strong>
                    {survey.nama_konstruksi ?? '-'}
                  </p>
                  <p>
                    <strong>Tiang:</strong>
                    {survey.nama_material_tiang ?? '-'}
                  </p>
                  <p>
                    <strong>Panjang Jaringan: </strong>
                    {survey.panjang_jaringan}m
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
