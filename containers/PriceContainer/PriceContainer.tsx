import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUpdateSearchParams } from '~/hooks/useUpdateSearchParams'
import type { PriceRangeFilters } from '~/store/filters/filtersTypes'
import PriceRange from '../../components/form/PriceRange/PriceRange'

const PriceContainer: React.FC = () => {
  const searchParams = useSearchParams()
  const updateSearchParams = useUpdateSearchParams()
  const [priceRange, setPriceRange] = useState<PriceRangeFilters>({
    priceMin: Number(searchParams.get('price_min')) || null,
    priceMax: Number(searchParams.get('price_max')) || null
  })

  useEffect(() => {
    setPriceRange({
      priceMin: Number(searchParams.get('price_min')) || null,
      priceMax: Number(searchParams.get('price_max')) || null
    })
  }, [searchParams])

  // The onChange event keeps track of the current state of each price field, so
  // we're tracking that locally with useState, but we only want to update the
  // url and trigger a new fetch request with updateSearchParams when the onBlur
  // or onMenuItemSelected events occur.
  return (
    <PriceRange
      priceRange={priceRange}
      onChange={(newPriceRange) => {
        setPriceRange({ ...priceRange, ...newPriceRange })
      }}
      onBlur={() =>
        updateSearchParams({
          price_min: priceRange.priceMin,
          price_max: priceRange.priceMax
        })
      }
      onMenuItemSelected={(selectedPriceRange) => {
        const update = { ...priceRange, ...selectedPriceRange }
        updateSearchParams({
          price_min: update.priceMin || null,
          price_max: update.priceMax || null
        })
      }}
    />
  )
}

export default PriceContainer
