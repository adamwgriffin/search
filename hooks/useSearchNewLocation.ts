import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getNewLocationQueryString } from '~/lib/listingSearchParams'
import type { URLParams } from '~/types'

export function useSearchNewLocation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return function (newLocationParams: URLParams) {
    const updatedQueryString = getNewLocationQueryString(
      Object.fromEntries(searchParams),
      newLocationParams
    )
    router.push(`${pathname}?${updatedQueryString}`)
  }
}
