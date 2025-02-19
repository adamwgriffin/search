import { type ReactNode, useRef, useEffect, useCallback } from 'react'
import { useGoogleMaps } from '../../../providers/GoogleMapsProvider'
import styles from './GoogleMap.module.css'

export type GoogleMapState = {
  bounds: google.maps.LatLngBoundsLiteral | undefined
  center: google.maps.LatLngLiteral | undefined
  zoom: number | undefined
}

export type GoogleMapProps = {
  options: google.maps.MapOptions
  onDragEnd?: (currentMapState: GoogleMapState) => void
  onWheel?: (currentMapState: GoogleMapState) => void
  onIdle?: (currentMapState: GoogleMapState) => void
  children: ReactNode
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  options,
  children,
  onDragEnd,
  onWheel,
  onIdle
}) => {
  const mapEl = useRef<HTMLDivElement>(null)
  const { googleMap, setGoogleMap } = useGoogleMaps()

  const getCurrentMapState = useCallback((): GoogleMapState => {
    return {
      bounds: googleMap?.getBounds()?.toJSON(),
      center: googleMap?.getCenter()?.toJSON(),
      zoom: googleMap?.getZoom()
    }
  }, [googleMap])

  useEffect(() => {
    if (!mapEl.current) return
    if (!googleMap) {
      setGoogleMap(new google.maps.Map(mapEl.current, options))
    } else {
      googleMap.setOptions(options)
    }
  }, [googleMap, options, setGoogleMap])

  const onWheelCallback = useCallback(
    () => onWheel?.(getCurrentMapState()),
    [getCurrentMapState, onWheel]
  )

  useEffect(() => {
    if (!googleMap) return
    const mapEventListeners: google.maps.MapsEventListener[] = []
    onDragEnd &&
      mapEventListeners.push(
        google.maps.event.addListener(googleMap, 'dragend', () =>
          onDragEnd?.(getCurrentMapState())
        )
      )
    onIdle &&
      mapEventListeners.push(
        google.maps.event.addListener(googleMap, 'idle', () => {
          onIdle?.(getCurrentMapState())
        })
      )
    onWheel && googleMap.getDiv().addEventListener('wheel', onWheelCallback)
    // The events get re-added each time a dependency changes in this useEffect,
    // so we have to clean them up, otherwise they will multiply quickly and
    // cause many unecessary api requests.
    return () => {
      mapEventListeners.forEach((eventListener) =>
        google.maps.event.removeListener(eventListener)
      )
      googleMap.getDiv().removeEventListener('wheel', onWheelCallback)
      mapEventListeners.length = 0
    }
  }, [getCurrentMapState, googleMap, onDragEnd, onIdle, onWheel, onWheelCallback])

  return (
    <div ref={mapEl} id={styles.googleMap}>
      {googleMap && children}
    </div>
  )
}

export default GoogleMap
