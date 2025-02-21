import { usePathname, useRouter } from 'next/navigation'
import { getNewLocationQueryString } from '~/lib/listingSearchParams'
import { useSearchParamsState } from '~/providers/SearchParamsProvider'
import type { SearchParams } from '~/zod_schemas/searchParamsSchema'

export function useSearchNewLocation() {
  const router = useRouter()
  const pathname = usePathname()
  const { searchParamsState: searchState } = useSearchParamsState()

  return function (newLocationParams: SearchParams) {
    const updatedQueryString = getNewLocationQueryString(
      searchState,
      newLocationParams
    )
    router.push(`${pathname}?${updatedQueryString}`)
  }
}
