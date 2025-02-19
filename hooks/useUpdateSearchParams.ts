import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getUpdatedQueryString } from '~/lib/listingSearchParams'
import type { URLParams } from '~/types'

export function useUpdateSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return function (newParams: URLParams) {
    const updatedQueryString = getUpdatedQueryString(
      Object.fromEntries(searchParams),
      newParams
    )
    const url =
      updatedQueryString === '' ? pathname : `${pathname}?${updatedQueryString}`
    router.push(url)
  }
}
