'use client'

import L from 'leaflet'
import { useEffect, useState } from 'react'
import { LayersControl, MapContainer, TileLayer } from 'react-leaflet'
import { toast } from 'sonner'
import RoutingControl from './RoutingControl'

import './routing-styles.css'

const maps = {
  base: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}

export default function RoutingMap() {
  const [waypoints, setWaypoints] = useState<L.LatLng[] | undefined>(undefined)

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Browser anda tidak mendukung geolokasi!')
    }

    const defaultPos = L.latLng(-7.354673070392906, 112.69516483989786)
    const eastPos = L.latLng(-7.350177294362741, 112.70293170240086)

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        const currentPos = L.latLng(latitude, longitude)
        const longitudeOffset =
          1 / (111.32 * Math.cos((latitude * Math.PI) / 180))
        const eastPos = L.latLng(latitude, longitude + longitudeOffset)
        setWaypoints([currentPos, eastPos])
      },
      error => {
        console.error('Error getting user location:', error)
        if (error.code === error.PERMISSION_DENIED) {
          toast.error(
            'Akses geolokasi ditolak! Harap aktifkan geolokasi untuk dapat menggunakan map.'
          )
        } else {
          toast.error('Gagal mendapatkan posisi saat ini.')
        }
        setWaypoints([defaultPos, eastPos])
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 3600000
      }
    )
  }, [])

  return (
    <MapContainer
      center={[-7.245343402100674, 112.73873405427051]}
      zoom={10}
      style={{ height: '650px', width: '100%', padding: 0 }}
    >
      <RoutingControl waypoints={waypoints} />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Map">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={maps.base}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  )
}
