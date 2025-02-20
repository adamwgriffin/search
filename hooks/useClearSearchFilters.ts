import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { objectToQueryString } from '~/lib/listingSearchParams'

export function useClearSearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return function () {
    const address = searchParams.get('address')
    const url = address
      ? `${pathname}?${objectToQueryString({ address })}`
      : pathname
    router.push(url)
  }
}
