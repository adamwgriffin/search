'use client'

import type { NextPage } from 'next'
import { useMemo, useCallback } from 'react'
import { useMedia } from 'react-use'
import { useSession } from 'next-auth/react'
import { GoogleMapsMapOptions } from '../../config/googleMapsOptions'
import { GoogleMapsPolygonOptions } from '../../config/googleMapsOptions'
import styles from './ListingMap.module.css'
import GoogleMap, {
  GoogleMapState
} from '../../components/map/GoogleMap/GoogleMap'
import ListingMarker from '../../components/map/ListingMarker/ListingMarker'
import MapBoundary from '../../components/map/MapBoundary/MapBoundary'
import MapControl from '../../components/map/MapControl/MapControl'
import ZoomControl from '../../components/map/ZoomControl/ZoomControl'
import { useAppSelector, useAppDispatch } from '../../hooks/app_hooks'
import { useOpenListingDetail } from '../../hooks/open_listing_detail_hook'
import {
  setBoundaryActive,
  setMapData
} from '../../store/listingMap/listingMapSlice'
import { selectMapState } from '../../store/listingMap/listingMapSelectors'
import {
  setDoListingSearchOnMapIdle,
  setSelectedListing
} from '../../store/listingSearch/listingSearchSlice'
import {
  selectDoListingSearchOnMapIdle,
  selectListings,
  selectListingSearchRunning,
  selectHighlightedMarker
} from '../../store/listingSearch/listingSearchSelectors'
import { resetStartIndex } from '../../store/filters/filtersSlice'
import {
  convertViewportToLatLngBoundsLiteral,
  getGeoLayerBounds
} from '../../lib/polygon'
import {
  searchWithUpdatedFilters,
  searchCurrentLocation
} from '../../store/listingSearch/listingSearchCommon'
import { useGoogleMaps } from '../../providers/GoogleMapsProvider'

const ListingMap: NextPage = () => {
  const { googleLoaded } = useGoogleMaps()
  const { status } = useSession()
  const dispatch = useAppDispatch()
  const openListingDetail = useOpenListingDetail(true)
  const isSmallAndUp = useMedia('(min-width: 576px)', false)
  const mapState = useAppSelector(selectMapState)
  const doListingSearchOnMapIdle = useAppSelector(
    selectDoListingSearchOnMapIdle
  )
  const listings = useAppSelector(selectListings)
  const listingSearchRunning = useAppSelector(selectListingSearchRunning)
  const highlightedMarker = useAppSelector(selectHighlightedMarker)

  // Memoizing bounds is important here because without it we can wind up in an
  // endless loop. With each render, we pass bounds to the <GoogleMap> bounds
  // prop, which causes <GoogleMap> to call fitBounds(bounds). Calling
  // fitBounds() triggers an onIdle event from <GoogleMap>, which we handle by
  // dispatching setMap. since setMap changes the listingtMap store, it may
  // cause <ListingMap> to re-render. without useMemo the bounds can be exactly
  // the same but will have a new reference ID, which will trigger the cycle
  // again as if there were new bounds.
  const bounds = useMemo(() => {
    if (mapState.geoLayerCoordinates.length) {
      return getGeoLayerBounds(mapState.geoLayerCoordinates)
    }
    if (mapState.viewportBounds) {
      return convertViewportToLatLngBoundsLiteral(mapState.viewportBounds)
    }
    return null
  }, [mapState.geoLayerCoordinates, mapState.viewportBounds])

  const handleListingMarkerMouseEnter = useCallback(
    (listingid: string) => {
      isSmallAndUp && dispatch(setSelectedListing(listingid))
    },
    [dispatch, isSmallAndUp]
  )

  const handleListingMarkerMouseLeave = useCallback(() => {
    isSmallAndUp && dispatch(setSelectedListing(null))
  }, [dispatch, isSmallAndUp])

  const handleListingMarkerMouseClick = useCallback(
    (listingSlug: string) => {
      openListingDetail(`/listing/${listingSlug}`, listingSlug)
    },
    [openListingDetail]
  )

  const handleBoundaryControlClick = useCallback(() => {
    dispatch(setBoundaryActive(false))
    dispatch(searchWithUpdatedFilters())
  }, [dispatch])

  const handleUserAdjustedMap = useCallback(
    async (currentMapState: Partial<GoogleMapState>) => {
      dispatch(setMapData(currentMapState))
      dispatch(resetStartIndex())
      dispatch(setDoListingSearchOnMapIdle(true))
    },
    [dispatch]
  )

  const handleIdle = useCallback(
    (newMapState: GoogleMapState) => {
      dispatch(setMapData(newMapState))
      if (doListingSearchOnMapIdle) {
        dispatch(setDoListingSearchOnMapIdle(false))
        dispatch(searchCurrentLocation())
      }
    },
    [dispatch, doListingSearchOnMapIdle]
  )

  const handleZoomIn = useCallback(() => {
    handleUserAdjustedMap({ zoom: mapState.zoom + 1 })
  }, [handleUserAdjustedMap, mapState.zoom])

  const handleZoomOut = useCallback(() => {
    handleUserAdjustedMap({ zoom: mapState.zoom - 1 })
  }, [handleUserAdjustedMap, mapState.zoom])

  if (!googleLoaded) return <div className={styles.listingMap}></div>

  return (
    <div className={styles.listingMap}>
      <GoogleMap
        options={GoogleMapsMapOptions}
        bounds={bounds}
        zoom={mapState.zoom}
        onIdle={handleIdle}
        onDragEnd={handleUserAdjustedMap}
        onWheel={handleUserAdjustedMap}
      >
        {listings.map((l, i) => (
          <ListingMarker
            key={l._id.toString()}
            authenticaticated={status === 'authenticated'}
            listing={l}
            highlighted={highlightedMarker === l._id}
            zIndex={i}
            onMouseEnter={handleListingMarkerMouseEnter}
            onMouseLeave={handleListingMarkerMouseLeave}
            onClick={handleListingMarkerMouseClick}
          />
        ))}
        <MapBoundary
          coordinates={mapState.geoLayerCoordinates}
          visible={mapState.boundaryActive}
          options={GoogleMapsPolygonOptions}
        />
      </GoogleMap>
      <MapControl
        boundaryActive={mapState.boundaryActive}
        listingSearchRunning={listingSearchRunning}
        onBoundaryControlClick={handleBoundaryControlClick}
      />
      <ZoomControl onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </div>
  )
}

export default ListingMap
