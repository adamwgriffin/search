import { useRouter } from 'next/navigation'
import { FiltersState } from '../store/filters/filtersTypes'
import { searchStateToListingSearchURLParams } from '../lib/url'

export const usePushParamsToSearchUrl = () => {
  const router = useRouter()

  return (filterState: Partial<FiltersState>) => {
    router.push(
      '/?' +
        new URLSearchParams(searchStateToListingSearchURLParams(filterState))
    )
  }
}
