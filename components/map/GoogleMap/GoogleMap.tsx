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
  bounds?: google.maps.LatLngBoundsLiteral | null
  zoom?: number
  onDragEnd?: (currentMapState: GoogleMapState) => void
  onUserChangedZoom?: (currentMapState: GoogleMapState) => void
  onIdle?: (currentMapState: GoogleMapState) => void
  children: ReactNode
}

let fitBoundsInProgress = false

const GoogleMap: React.FC<GoogleMapProps> = ({
  options,
  bounds,
  zoom = 12,
  children,
  onDragEnd,
  onUserChangedZoom,
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

  useEffect(() => {
    if (googleMap && googleMap.getZoom() !== zoom) {
      googleMap.setZoom(zoom)
    }
  }, [zoom, googleMap])

  // A side effect of calling fitBounds() is that it may sometimes trigger a
  // "zoom_changed" event. We only want to call things like the
  // onUserChangedZoom() event callback if the user actually took some action to
  // trigger "zoom_changed," so we set the fitBoundsInProgress flag and unset it
  // later so we can tell the difference.
  useEffect(() => {
    if (bounds && googleMap) {
      fitBoundsInProgress = true
      googleMap.fitBounds(bounds)
    }
  }, [bounds, googleMap])

  useEffect(() => {
    if (!googleMap) return
    const eventListeners: google.maps.MapsEventListener[] = []
    onDragEnd && eventListeners.push(
      google.maps.event.addListener(googleMap, 'dragend', () =>
        onDragEnd?.(getCurrentMapState())
      )
    )
    onUserChangedZoom && eventListeners.push(
      google.maps.event.addListener(googleMap, 'zoom_changed', () => {
        // Make sure we only call this when a user action changed the zoom event
        // rather than the bounds changing
        if (!fitBoundsInProgress) {
          onUserChangedZoom?.(getCurrentMapState())
        }
      })
    )
    onIdle && eventListeners.push(
      google.maps.event.addListener(googleMap, 'idle', () => {
        // Reset fitBoundsInProgress after fitBounds() completes and map is
        // idle.
        fitBoundsInProgress = false
        onIdle?.(getCurrentMapState())
      })
    )
    // The events get re-added each time a dependency changes in this useEffect,
    // so we have to clean them up, otherwise they will multiply quickly and
    // cause many unecessary api requests.
    return () => {
      eventListeners.forEach((eventListener) =>
        google.maps.event.removeListener(eventListener)
      )
      eventListeners.length = 0
    }
  }, [getCurrentMapState, googleMap, onDragEnd, onIdle, onUserChangedZoom])

  return (
    <div ref={mapEl} id={styles.googleMap}>
      {googleMap && children}
    </div>
  )
}

export default GoogleMap
