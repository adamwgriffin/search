import type { PriceRangeFilters } from '../../../store/filters/filtersTypes'
import { useState } from 'react'
import Price from '../Price/Price'
import InputRangeSeparator from '../../design_system/InputRangeSeparator/InputRangeSeparator'
import styles from './PriceRange.module.css'

export type PriceRangeProps = {
  priceRange: PriceRangeFilters
  onFocus?: () => void
  onBlur?: () => void
  onChange?: (priceRange: Partial<PriceRangeFilters>) => void
  onMenuItemSelected?: (priceRange: Partial<PriceRangeFilters>) => void
}

const PriceRange: React.FC<PriceRangeProps> = ({
  priceRange,
  onFocus,
  onBlur,
  onChange,
  onMenuItemSelected
}) => {
  const [minOpen, setMinOpen] = useState(false)
  const [maxOpen, setMaxOpen] = useState(false)

  const handleMinFocus = () => {
    onFocus?.()
    setMaxOpen(false)
    setMinOpen(true)
  }

  const handleMinClickAway = () => {
    setMinOpen(false)
  }

  const handleMaxClickAway = () => {
    setMaxOpen(false)
  }

  const handleMaxFocus = () => {
    onFocus?.()
    setMinOpen(false)
    setMaxOpen(true)
  }

  return (
    <fieldset className={styles.price}>
      <legend className={styles.legend}>Price Range</legend>

      <Price
        label='Min Price'
        placeholder='Min'
        price={priceRange.priceMin}
        menuOpen={minOpen}
        onFocus={handleMinFocus}
        onBlur={onBlur}
        onClickAway={handleMinClickAway}
        onMenuItemSelected={(priceMin) => {
          setMinOpen(false)
          onMenuItemSelected?.({ priceMin })
        }}
        onChange={(priceMin) => onChange?.({ priceMin })}
      />

      <InputRangeSeparator />

      <Price
        label='Max Price'
        placeholder='Max'
        price={priceRange.priceMax}
        menuOpen={maxOpen}
        onFocus={handleMaxFocus}
        onBlur={onBlur}
        onClickAway={handleMaxClickAway}
        onMenuItemSelected={(priceMax) => {
          setMaxOpen(false)
          onMenuItemSelected?.({ priceMax })
        }}
        onChange={(priceMax) => onChange?.({ priceMax })}
      />

    </fieldset>
  )
}

export default PriceRange
