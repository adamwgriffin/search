import { useRouter } from 'next/navigation'
import { FiltersState } from '../store/filters/filtersTypes'
import { searchStateToListingSearchURLParams } from '../lib/url'

export const useRedirectToSearch = () => {
  const router = useRouter()

  return (filterState: Partial<FiltersState>) => {
    router.push(
      '/homes?' +
        new URLSearchParams(searchStateToListingSearchURLParams(filterState))
    )
  }
}
