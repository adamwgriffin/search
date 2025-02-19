import { useSearchParams } from 'next/navigation'
import { convertURLBoundsParamToLatLngBoundsLiteral } from '~/lib/boundary'

/**
 * A hook that handles computing state derived from the url search params
 */
export function useSearchParamsState() {
  const searchParams = useSearchParams()

  const params = Object.fromEntries(searchParams.entries())

  const bounds = params.bounds
    ? convertURLBoundsParamToLatLngBoundsLiteral(params.bounds)
    : null

  const zoom = params.zoom ? Number(params.zoom) : null

  const showRemoveBoundaryButton = Boolean(
    params.address || params.place_id || params.boundary_id
  )

  return { bounds, zoom, showRemoveBoundaryButton }
}
