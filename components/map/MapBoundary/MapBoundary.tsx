import { useGoogleMaps } from '~/providers/GoogleMapsProvider'
import { useEffect } from 'react'
import type { GeoJSONBoundary } from '~/types'

export type MapBoundaryProps = {
  boundary: GeoJSONBoundary | null
} & google.maps.Data.StyleOptions

export default function MapBoundary({ boundary, ...styleOptions }: MapBoundaryProps) {
  const { googleMap } = useGoogleMaps()

  useEffect(() => {
    if (!googleMap || !boundary) return
    const feature = googleMap.data.addGeoJson(boundary)[0]
    googleMap.data.setStyle(styleOptions)
    return () => {
      googleMap.data.remove(feature)
    }
  }, [googleMap, boundary, styleOptions])

  return null
}
